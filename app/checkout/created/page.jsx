"use client";
import React, { useState, useCallback, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ApiServices from "@/lib/ApiServices";
import { useAppcontext } from "@/context/AppContext";

function CheckoutContent() {
    const { getUsersOrders  } = useAppcontext();
    const params = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [orderId, setOrderId] = useState(null);

    const sessionId = params.get("session_id");
    const router = useRouter();

    const orderCreationAttemptedRef = useRef(false);

    const handleSubscriptionStorage = useCallback(async (sessionId) => {
        if (orderCreationAttemptedRef.current) return;
        orderCreationAttemptedRef.current = true;

        setLoading(true);
        try {
            const order = localStorage.getItem("orderData");
            if (!order) {
                throw new Error("No order data found");
            }

            const currentOrder = JSON.parse(order);

            setOrderData(currentOrder);

            if (sessionId) {
                const res = await ApiServices.createOrder(currentOrder);
                if (res.data.success) {
                    setOrderId(res.data.order.orderId);
                    localStorage.removeItem("cartItems");
                    localStorage.removeItem("orderData");
                }
                await getUsersOrders()
                router.replace("/checkout/created");
            }
        } catch (err) {
            console.error("Error in handleSubscriptionStorage:", err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (sessionId) {
            handleSubscriptionStorage(sessionId);
        }
    }, [sessionId, handleSubscriptionStorage]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Clock className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-medium animate-spin"><Loader2/></p>
            </div>
        );
    }

    return (
        <div className="container w-[100vw] flex justify-center items-center mx-auto  py-8">
            {orderId ? (
                <Card className="border-primary">
                    <CardHeader className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold mt-4">Order Confirmed!</CardTitle>
                        <CardDescription>
                            Thank you for your purchase. Your order has been received and is being processed.
                        </CardDescription>
                        <Badge variant="outline" className="mx-auto mt-2">
                            Order ID: {orderId}
                        </Badge>
                    </CardHeader>

                    <Separator className="my-4" />

                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Order Date</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span>Credit Card</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping Address</span>
                                <span className="text-right">
                                    {orderData.address.address}<br />
                                    {orderData.address.city}<br />
                                    {orderData.address.country}
                                </span>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <h3 className="font-medium mb-4">Order Summary</h3>
                        <div className="space-y-4">
                            {orderData?.items?.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-md bg-gray-100"></div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">${item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-2">

                            <div className="flex justify-between font-bold text-lg mt-2">
                                <span>Total</span>
                                <span>${orderData?.total}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" onClick={() => router.push("/my-orders")}>
                            View Order Details
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                            Continue Shopping
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <p className="text-lg font-medium">No order found</p>
                    <Button onClick={() => router.push("/")}>Return to Home</Button>
                </div>
            )}
        </div>
    );
}

function Page() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loading /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}

export default Page;