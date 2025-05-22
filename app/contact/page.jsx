"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      valid = false;
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        console.log("Form submitted:", formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      }, 1000);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Email Us",
      details: "info@stylehub.com",
      action: "mailto:info@stylehub.com",
    },
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Visit Us",
      details: "123 Fashion Ave, New York, NY 10001",
      action: "https://maps.google.com",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Business Hours",
      details: "Mon-Fri: 9AM - 6PM\nSat: 10AM - 4PM",
      action: null,
    },
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Have questions or feedback? We'd love to hear from you! Reach out through any of the
          methods below.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <section>
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message here..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={handleChange}
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="space-y-8">
          {/* Contact Methods */}
          <div className="grid sm:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{method.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{method.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{method.details}</p>
                      {method.action && (
                        <Button variant="link" className="px-0 mt-2" asChild>
                          <Link href={method.action}>Contact</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">What's your return policy?</h4>
                <p className="text-gray-600 text-sm mt-1">
                  We accept returns within 30 days of purchase. Items must be unworn with tags
                  attached.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium">How long does shipping take?</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Standard shipping takes 3-5 business days. Express options available at
                  checkout.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium">Do you offer international shipping?</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Yes! We ship to over 50 countries worldwide with calculated shipping rates at
                  checkout.
                </p>
              </div>
            </CardContent>
          </Card>

        </section>
      </div>
    </main>
  );
}