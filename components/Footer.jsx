import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

function Footer() {
    return (

        <footer className="bg-gray-100 border-t">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">About Us</h3>
                        <p className="text-sm text-gray-600">
                            We're dedicated to providing high-quality products with exceptional customer service.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Customer Service</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact Us</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">FAQs</Link></li>
                            <li><Link href="#" className="text-gray-600 hover:text-blue-600">Track Order</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/collections" className="text-gray-600 hover:text-blue-600">New Arrivals</Link></li>
                            <li><Link href="/collections" className="text-gray-600 hover:text-blue-600">Best Sellers</Link></li>
                            <li><Link href="/collections" className="text-gray-600 hover:text-blue-600">Sale Items</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Newsletter</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Subscribe to receive updates on new products and special promotions.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-l-md border border-r-0 px-3 py-2 text-sm"
                            />
                            <Button className="rounded-l-none">Subscribe</Button>
                        </div>
                    </div>
                </div>
                <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Fusion Wear. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer