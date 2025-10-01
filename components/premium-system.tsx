import { useEffect, useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Crown, Check } from "lucide-react"

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
    <div className="max-w-xl mx-auto mt-10 px-4 font-sans">
      {isPremium ? (
        <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">Premium Member</h3>
            <span className="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded">Active</span>
          </div>
          <p className="text-yellow-700 text-sm">
            You have access to all premium features including exclusive habitats and faster evolution!
          </p>
        </div>
      ) : (
        <>
          <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg shadow-sm mb-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-8 w-8 text-yellow-600" />
                <h3 className="text-xl font-bold text-yellow-800">Upgrade to Premium</h3>
              </div>
              <p className="text-yellow-700 text-sm">
                Unlock exclusive habitats, faster evolution, and unlimited mood logging!
              </p>
              <div className="text-2xl font-bold text-yellow-800">$4.99</div>
              <button
                onClick={() => setShowDialog(true)}
                className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
              >
                Upgrade Now
              </button>
            </div>
          </div>

          {showDialog && (
            <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-yellow-800">MoodZoo Premium</h2>
              </div>

              <div className="space-y-3 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-lg">{feature.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{feature.title}</div>
                      <div className="text-xs text-gray-500">{feature.description}</div>
                    </div>
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  </div>
                ))}
              </div>

              <PayPalScriptProvider options={{ "client-id": "EJURH8pFVawDFECb63FPfrt7iCz4cnIH07t3y7Suh_impTl_OElONCpvytosT8Uw1awwpgm5jAsi6jw6", currency: "USD" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{ amount: { value: "4.99" } }],
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
                    console.error("PayPal payment error:", err)
                    alert("Something went wrong with the payment. Please try again.")
                  }}
                />
              </PayPalScriptProvider>

              <div className="text-xs text-gray-500 text-center mt-2">
                Secure payment processed by PayPal
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
