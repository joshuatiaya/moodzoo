// pages/premium.tsx or any other React page
"use client"

import { useEffect, useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Crown, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PremiumPage() {
  const [isPremium, setIsPremium] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    const status = localStorage.getItem("isPremium") === "true"
    setIsPremium(status)
  }, [])

  const premiumFeatures = [
    { icon: "🏰", title: "Exclusive Habitats", description: "Access to Mystic Garden, Crystal Cave, and Sky Palace" },
    { icon: "⚡", title: "Faster Evolution", description: "Only need 2 animals to evolve instead of 3" },
    { icon: "∞", title: "Unlimited Moods", description: "Log as many moods as you want per day" },
    { icon: "🎨", title: "Custom Themes", description: "Personalize your zoo with premium themes" },
    { icon: "📊", title: "Advanced Analytics", description: "Detailed insights and mood patterns" },
    { icon: "🔔", title: "Smart Reminders", description: "Personalized mood tracking reminders" },
  ]

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      {isPremium ? (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">Premium Member</h3>
            <Badge className="bg-yellow-600 text-white">Active</Badge>
          </div>
          <p className="text-yellow-700 text-sm">
            You have access to all premium features including exclusive habitats and faster evolution!
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-6 border-2 border-dashed border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-8 w-8 text-yellow-600" />
                <h3 className="text-xl font-bold text-yellow-800">Upgrade to Premium</h3>
              </div>
              <p className="text-yellow-700">Unlock exclusive habitats, faster evolution, and unlimited mood logging!</p>
              <div className="text-2xl font-bold text-yellow-800">$4.99</div>
              <Button onClick={() => setShowDialog(true)} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </Card>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  MoodZoo Premium
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-800">$4.99</div>
                  <div className="text-sm text-muted-foreground">One-time purchase</div>
                </div>

                <div className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-lg">{feature.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{feature.title}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    </div>
                  ))}
                </div>

                <PayPalScriptProvider options={{ "client-id": "EGAyMioXpt3UZTBi5yzXpg0txQZfYl2unGBuCU37MFEeicKMXEgHUsE2e7IRknp-TDAGmYgM0EqatpOF", currency: "USD" }}>
                  <PayPalButtons
                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: "4.99",
                            },
                          },
                        ],
                      })
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order?.capture()
                      if (details?.status === "COMPLETED") {
                        localStorage.setItem("isPremium", "true")
                        localStorage.setItem("premiumPurchaseDate", new Date().toISOString())
                        setIsPremium(true)
                        setShowDialog(false)
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal Error", err)
                    }}
                  />
                </PayPalScriptProvider>

                <div className="text-center text-xs text-muted-foreground">
                  Secure payment processed by PayPal
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
