"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ChevronDown, MoreVertical, MapPin } from "lucide-react";
import { useState } from "react";
import { useAppcontext } from "@/context/AppContext";
import ApiServices from "@/lib/ApiServices";

const statusOptions = ["All", "Pending", "Dispatched", "Delivered", "Canceled"];

export default function OrdersPage() {
  const { allOrders, setAllOrders } = useAppcontext();
  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const data = { status: newStatus };
      const res = await ApiServices.updateOrder(orderId, data);
      if (res.data.success) {
        setAllOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filter orders based on search and status
  const filteredOrders = allOrders?.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.address?.firstName} ${order.address?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
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

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders Management</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders?.length > 0 ? (
                currentOrders.map((order) => (
                  <>
                    <TableRow 
                      key={order._id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleOrderExpansion(order._id)}
                    >
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        {order.address?.firstName} {order.address?.lastName}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.total?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.items?.length}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order._id, "Pending")
                              }
                              disabled={order.status === "Pending"}
                            >
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order._id, "Dispatched")
                              }
                              disabled={order.status === "Dispatched"}
                            >
                              Mark as Dispatched
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order._id, "Delivered")
                              }
                              disabled={order.status === "Delivered"}
                            >
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order._id, "Canceled")
                              }
                              disabled={order.status === "Canceled"}
                            >
                              Mark as Canceled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedOrder === order._id && (
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={7}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div>
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                                <div>
                                  <p>{order.address?.address}</p>
                                  <p>
                                    {order.address?.city}, {order.address?.country} {order.address?.zipCode}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {order.address?.firstName} {order.address?.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600">{order.address?.email}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {order.items?.map((item) => (
                                  <div key={item.id} className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{item.name}</span>
                                      <span className="text-sm text-gray-600">
                                        (x{item.quantity})
                                      </span>
                                    </div>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}