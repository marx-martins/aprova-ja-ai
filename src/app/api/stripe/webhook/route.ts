import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId) {
          await db.user.update({
            where: { id: userId },
            data: {
              subscription: "pro",
              simulationsLimit: 999999, // Unlimited
            },
          })

          // Create subscription record
          await db.subscription.upsert({
            where: { userId },
            update: {
              stripeSubscriptionId: session.subscription as string,
              status: "active",
            },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              status: "active",
            },
          })
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await db.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await db.subscription.update({
            where: { userId: user.id },
            data: {
              status: subscription.status === "active" ? "active" : "inactive",
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          })

          await db.user.update({
            where: { id: user.id },
            data: {
              subscription: subscription.status === "active" ? "pro" : "free",
              simulationsLimit: subscription.status === "active" ? 999999 : 3,
            },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await db.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await db.subscription.update({
            where: { userId: user.id },
            data: {
              status: "canceled",
            },
          })

          await db.user.update({
            where: { id: user.id },
            data: {
              subscription: "free",
              simulationsLimit: 3,
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    )
  }
}
