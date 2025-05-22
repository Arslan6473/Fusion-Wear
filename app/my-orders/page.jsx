"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, MapPin, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppcontext } from "@/context/AppContext";

const statusOptions = ["All", "Delivered", "Dispatched", "Pending", "Canceled"];

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { usersOrders } = useAppcontext();
  const ordersPerPage = 4;

  // Filter orders based on search and status
  const filteredOrders = usersOrders?.filter((order) => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders?.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders?.length / ordersPerPage);

  // Status badge variant mapping
  const getStatusVariant = (status) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Dispatched":
        return "secondary";
      case "Pending":
        return "outline";
      case "Canceled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Orders</h1>
            <p className="text-gray-600">View and track your order history</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Need help with an order?</span>
            <Link href={"/contact"} className="p-0 h-auto cursor-pointer">
              Contact Support
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by order ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        {currentOrders?.length > 0 ? (
          <div className="space-y-6">
            {currentOrders.map((order) => (
              <div key={order._id} className="border rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b">
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      <h3 className="font-medium">Order #{order.orderId}</h3>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-lg font-medium">
                    ${order.total.toFixed(2)}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="p-4 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                        <p>{order.address?.firstName} {order.address?.lastName}</p>
                        <p className="text-sm text-gray-600">{order.address?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Shipping Address</h4>
                        <p>{order.address?.address}</p>
                        <p className="text-sm text-gray-600">
                          {order.address?.city}, {order.address?.country} {order.address?.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-4 flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg p-12 text-center">
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet"}
            </p>
            {!searchTerm && statusFilter === "All" && (
              <Button className="mt-4">Start Shopping</Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}