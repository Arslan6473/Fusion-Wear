"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppcontext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Home() {
  const {products} = useAppcontext();
  const router = useRouter();
  return (
    <main className="flex-1">
      <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Discover Your Perfect Style This Season
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Explore our new collection of premium fashion items designed for
              comfort and style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={"/collections"}>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 cursor-pointer hover:bg-blue-50"
                >
                  View Collections
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/heroImage.png"
              alt="Fashion Collection"
              className="rounded-lg shadow-xl max-w-md w-full object-cover"
            />
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-full bg-blue-100 mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Materials</h3>
              <p className="text-gray-600">
                We source the finest materials for all our products to ensure
                comfort and durability.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-full bg-blue-100 mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Ethical Production</h3>
              <p className="text-gray-600">
                Our manufacturing processes are sustainable and respect fair
                labor practices.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-full bg-blue-100 mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                We offer worldwide shipping and express delivery options to get
                your items quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href={"/collections"} className="text-blue-600">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.slice(0,4).map((product, index) => (
              <div
              onClick={() => {router.push(`/product/${product._id}`)}}
                key={index}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                
                 
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-blue-600 font-medium">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "I absolutely love the quality of their clothes. The attention to detail is amazing and everything fits perfectly.",
                author: "Sarah Johnson",
                title: "Loyal Customer",
              },
              {
                quote:
                  "The customer service is exceptional. They went above and beyond to help me find the perfect outfit for my event.",
                author: "Michael Chen",
                title: "Happy Shopper",
              },
              {
                quote:
                  "Fast shipping and beautiful packaging. The clothes are even better in person than in the photos. Will definitely shop again!",
                author: "Emily Rodriguez",
                title: "Fashion Enthusiast",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#FFD700"
                      stroke="#FFD700"
                      strokeWidth="1"
                      className="mr-1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Follow Our Style
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Tag your photos with #fusionwear to be featured on our Instagram
            feed
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <a
                key={index}
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block "
              >
                <img
                  src={`/insta${index + 1}.jpg`}
                  alt="Instagram post"
                  className="w-full rounded-md aspect-square object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
