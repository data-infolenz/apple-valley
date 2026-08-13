'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  Check,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  Clock,
  Plus,
  Minus,
  Shield,
  CheckCircle2,
  Copy,
  Phone,
  Download,
} from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type RoomTypeOption = {
  id: string;
  roomTypeId?: string;
  name: string;
  price: number;
  maxOccupancy: number;
  size: number;
  availableRooms?: number;
};

const fallbackRoomTypes: RoomTypeOption[] = [
  { id: 'budget-standard', name: 'Budget Standard Room', price: 2000, maxOccupancy: 2, size: 180 },
  { id: 'deluxe-hill-view', name: 'Deluxe Hill View Room', price: 3500, maxOccupancy: 2, size: 280 },
  { id: 'premium-balcony', name: 'Premium Balcony Room', price: 4500, maxOccupancy: 2, size: 320 },
  { id: 'family-cottage', name: 'Family Cottage', price: 6000, maxOccupancy: 4, size: 450 },
  { id: 'honeymoon-suite', name: 'Honeymoon Suite', price: 7500, maxOccupancy: 2, size: 400 },
];

const addOns = [
  { id: 'room-heater', name: 'Room Heater', price: 300, unit: 'per night', category: 'comfort' },
  { id: 'extra-blanket', name: 'Extra Blanket', price: 150, unit: 'per night', category: 'comfort' },
  { id: 'extra-bed', name: 'Extra Bed', price: 500, unit: 'per night', category: 'comfort' },
  { id: 'candle-dinner', name: 'Candle Light Dinner', price: 1500, unit: 'per couple', category: 'dining' },
  { id: 'bbq-dinner', name: 'BBQ Dinner', price: 1200, unit: 'per person', category: 'dining' },
  { id: 'campfire', name: 'Campfire Evening', price: 500, unit: 'per session', category: 'celebration' },
  { id: 'birthday-cake', name: 'Birthday Cake', price: 800, unit: 'per cake', category: 'celebration' },
];

const steps = [
  { id: 1, name: 'Room Selection', icon: MapPin },
  { id: 2, name: 'Guest Details', icon: Users },
  { id: 3, name: 'Add-ons', icon: Plus },
  { id: 4, name: 'Review & Payment', icon: CreditCard },
  { id: 5, name: 'Confirmation', icon: CheckCircle2 },
];

const indianStates = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

type PinCodePostOffice = {
  Name?: string;
  District?: string;
  State?: string;
};

function BookingContent() {
  const searchParams = useSearchParams();
  const packageSlug = searchParams.get('package') || undefined;
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');
  const [roomTypes, setRoomTypes] = useState<RoomTypeOption[]>(fallbackRoomTypes);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    roomType: '',
    rooms: 1,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestAddress: '',
    guestCity: '',
    guestDistrict: '',
    guestState: 'Tamil Nadu',
    guestPincode: '',
    specialRequests: '',
    selectedAddOns: [] as { id: string; quantity: number }[],
    couponCode: '',
    paymentMethod: '',
    agreeTerms: false,
  });
  const roomTypeParam = searchParams.get('roomType');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');

  useEffect(() => {
    const loadRoomTypes = async () => {
      try {
        const response = await fetch('/api/rooms/types?active=true');
        const result = await response.json();

        if (!response.ok || !result.success) {
          return;
        }

        const fetchedRoomTypes = result.data.map((room: {
          _id: string;
          slug: string;
          name: string;
          basePrice: number;
          maxOccupancy: number;
          size: number;
        }) => ({
          id: room.slug,
          roomTypeId: room._id,
          name: room.name,
          price: room.basePrice,
          maxOccupancy: room.maxOccupancy,
          size: room.size,
        }));

        if (fetchedRoomTypes.length) {
          setRoomTypes(fetchedRoomTypes);
        }
      } catch {
        // Keep the static room list if the room API is not reachable yet.
      }
    };

    loadRoomTypes();
  }, []);

  useEffect(() => {
    const guests = guestsParam ? parseInt(guestsParam, 10) : undefined;

    setBookingData(prev => ({
      ...prev,
      checkIn: checkInParam || prev.checkIn,
      checkOut: checkOutParam || prev.checkOut,
      adults: guests && guests > 0 ? guests : prev.adults,
      roomType: roomTypeParam && roomTypes.find(r => r.id === roomTypeParam)
        ? roomTypeParam
        : prev.roomType,
    }));
  }, [checkInParam, checkOutParam, guestsParam, roomTypeParam, roomTypes]);

  useEffect(() => {
    if (!bookingData.checkIn || !bookingData.checkOut) return;

    const loadAvailability = async () => {
      try {
        const params = new URLSearchParams({
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
        });
        const response = await fetch(`/api/rooms/availability?${params.toString()}`);
        const result = await response.json();

        if (!response.ok || !result.success) return;

        setRoomTypes((current) => current.map((room) => {
          const availability = result.data.find((item: { slug: string }) => item.slug === room.id);
          return availability ? { ...room, availableRooms: availability.availableRooms } : room;
        }));
      } catch {
        // Keep existing room options if availability cannot be loaded.
      }
    };

    loadAvailability();
  }, [bookingData.checkIn, bookingData.checkOut]);

  const nights = (() => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  })();

  const selectedRoom = roomTypes.find(r => r.id === bookingData.roomType);
  const roomTotal = selectedRoom ? selectedRoom.price * nights * bookingData.rooms : 0;

  const addOnTotal = bookingData.selectedAddOns.reduce((total, item) => {
    const addon = addOns.find(a => a.id === item.id);
    if (!addon) return total;
    const unitMultiplier = addon.unit.includes('per night') ? nights : 1;
    return total + addon.price * item.quantity * unitMultiplier;
  }, 0);

  const subtotal = roomTotal + addOnTotal;
  const taxAmount = subtotal * 0.12;
  const grandTotal = subtotal + taxAmount;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.roomType || nights < 1) {
        toast.error('Please select valid dates and room type');
        return;
      }
      if (selectedRoom?.availableRooms !== undefined && bookingData.rooms > selectedRoom.availableRooms) {
        toast.error(`Only ${selectedRoom.availableRooms} ${selectedRoom.name} available for these dates`);
        return;
      }
    }
    if (currentStep === 2) {
      if (!bookingData.guestName || !bookingData.guestEmail || !bookingData.guestPhone) {
        toast.error('Please fill in all required guest details');
        return;
      }
    }
    if (currentStep === 4) {
      if (!bookingData.paymentMethod || !bookingData.agreeTerms) {
        toast.error('Please select payment method and accept terms');
        return;
      }
      handleConfirmBooking();
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);

    try {
      const selectedAddOns = bookingData.selectedAddOns
        .map((item) => {
          const addon = addOns.find(a => a.id === item.id);
          if (!addon) return null;

          return {
            name: addon.name,
            price: addon.price,
            quantity: item.quantity,
            unit: addon.unit.includes('per night') ? 'per_night' : 'per_booking',
          };
        })
        .filter(Boolean);

      const bookingPayload = {
        guest: {
          name: bookingData.guestName,
          email: bookingData.guestEmail,
          phone: bookingData.guestPhone,
            address: bookingData.guestAddress,
            city: bookingData.guestCity,
            district: bookingData.guestDistrict,
            state: bookingData.guestState,
            pincode: bookingData.guestPincode,
        },
        rooms: Array.from({ length: bookingData.rooms }, () => ({
          roomTypeId: selectedRoom?.roomTypeId,
          roomType: selectedRoom?.id,
        })),
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children,
        addOns: selectedAddOns,
        specialRequests: bookingData.specialRequests,
        couponCode: bookingData.couponCode,
        packageSlug,
        source: 'website',
      };
      const formData = new FormData();
      formData.append('booking', JSON.stringify(bookingPayload));
      if (documentFile) {
        formData.append('document', documentFile);
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to create booking');
      }

      setConfirmedBookingId(result.data.bookingId);
      setBookingConfirmed(true);
      setCurrentStep(5);
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOnChange = (id: string, quantity: number) => {
    setBookingData(prev => {
      const existing = prev.selectedAddOns.find(a => a.id === id);
      if (existing) {
        if (quantity === 0) return { ...prev, selectedAddOns: prev.selectedAddOns.filter(a => a.id !== id) };
        return { ...prev, selectedAddOns: prev.selectedAddOns.map(a => a.id === id ? { ...a, quantity } : a) };
      }
      return quantity > 0 ? { ...prev, selectedAddOns: [...prev.selectedAddOns, { id, quantity }] } : prev;
    });
  };

  const handlePincodeChange = async (value: string) => {
    const pincode = value.replace(/\D/g, '').slice(0, 6);
    setBookingData(prev => ({ ...prev, guestPincode: pincode }));

    if (pincode.length !== 6) {
      setDistrictOptions([]);
      return;
    }

    setIsPincodeLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = await response.json();
      const postOffices: PinCodePostOffice[] = result?.[0]?.PostOffice || [];

      if (!postOffices.length) {
        setDistrictOptions([]);
        toast.error('No city/state found for this pincode');
        return;
      }

      const districts = Array.from(new Set(postOffices.map((office) => office.District).filter(Boolean))) as string[];
      const firstOffice = postOffices[0];

      setDistrictOptions(districts);
      setBookingData(prev => ({
        ...prev,
        guestPincode: pincode,
        guestCity: firstOffice.Name || prev.guestCity,
        guestDistrict: firstOffice.District || prev.guestDistrict,
        guestState: firstOffice.State || prev.guestState,
      }));
    } catch {
      toast.error('Unable to fetch pincode details');
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const today = new Date().toISOString().split('T')[0];
  const minCheckout = bookingData.checkIn || today;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-forest-950">
      <Header />

      {/* Progress Steps */}
      <div className="bg-white dark:bg-forest-900 border-b border-forest-100 dark:border-forest-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center ${currentStep >= step.id ? 'text-forest-600' : 'text-forest-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id ? 'border-forest-600 bg-forest-600 text-white' : 'border-forest-200'
                  }`}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="ml-2 hidden sm:block text-sm font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${currentStep > step.id ? 'bg-forest-600' : 'bg-forest-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <AnimatePresence mode="wait" initial={false}>
                  {currentStep === 1 && (
                    <motion.div key="step1" initial={false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="font-heading text-2xl font-semibold text-forest-800 dark:text-white mb-6">Select Your Stay</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <Label>Check-in Date *</Label>
                          <Input type="date" min={today} className="mt-1" value={bookingData.checkIn} onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })} />
                        </div>
                        <div>
                          <Label>Check-out Date *</Label>
                          <Input type="date" min={minCheckout} className="mt-1" value={bookingData.checkOut} onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                          <Label>Adults</Label>
                          <Select value={bookingData.adults.toString()} onValueChange={(v) => setBookingData({ ...bookingData, adults: parseInt(v) })}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>{[1, 2, 3, 4, 5, 6].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Children</Label>
                          <Select value={bookingData.children.toString()} onValueChange={(v) => setBookingData({ ...bookingData, children: parseInt(v) })}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>{[0, 1, 2, 3, 4].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Rooms</Label>
                          <Select value={bookingData.rooms.toString()} onValueChange={(v) => setBookingData({ ...bookingData, rooms: parseInt(v) })}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>{[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Label className="mb-3 block">Select Room Type *</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {roomTypes.map((room) => {
                          const unavailable = room.availableRooms !== undefined && room.availableRooms <= 0;
                          return (
                          <Card key={room.id} className={`cursor-pointer transition-all ${bookingData.roomType === room.id ? 'ring-2 ring-forest-600 bg-forest-50 dark:bg-forest-900/50' : ''} ${unavailable ? 'opacity-60' : ''}`} onClick={() => !unavailable && setBookingData({ ...bookingData, roomType: room.id })}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-forest-800 dark:text-white">{room.name}</p>
                                  <p className="text-sm text-forest-600 dark:text-mist-400">{room.maxOccupancy} guests | {room.size} sq ft</p>
                                  {room.availableRooms !== undefined && (
                                    <p className={`text-sm mt-1 ${room.availableRooms > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {room.availableRooms} available for selected dates
                                    </p>
                                  )}
                                </div>
                                {bookingData.roomType === room.id && <CheckCircle2 className="w-5 h-5 text-forest-600" />}
                              </div>
                              <p className="text-lg font-bold text-forest-800 dark:text-white mt-2">₹{room.price.toLocaleString()}<span className="text-sm font-normal text-forest-500">/night</span></p>
                            </CardContent>
                          </Card>
                        )})}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" initial={false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="font-heading text-2xl font-semibold text-forest-800 dark:text-white mb-6">Guest Details</h2>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><Label>Full Name *</Label><Input className="mt-1" value={bookingData.guestName} onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })} /></div>
                          <div><Label>Phone Number *</Label><Input type="tel" className="mt-1" value={bookingData.guestPhone} onChange={(e) => setBookingData({ ...bookingData, guestPhone: e.target.value })} /></div>
                        </div>
                        <div><Label>Email Address *</Label><Input type="email" className="mt-1" value={bookingData.guestEmail} onChange={(e) => setBookingData({ ...bookingData, guestEmail: e.target.value })} /></div>
                        <div><Label>Address</Label><Textarea className="mt-1" value={bookingData.guestAddress} onChange={(e) => setBookingData({ ...bookingData, guestAddress: e.target.value })} /></div>
                        <div>
                          <Label>Document / Photo</Label>
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            className="mt-1"
                            onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                          />
                          <p className="text-xs text-forest-500 mt-1">JPG, PNG, WEBP, or PDF up to 5MB</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <Label>Pincode</Label>
                            <Input className="mt-1" value={bookingData.guestPincode} onChange={(e) => handlePincodeChange(e.target.value)} />
                            {isPincodeLoading && <p className="text-xs text-forest-500 mt-1">Finding city...</p>}
                          </div>
                          <div><Label>City</Label><Input className="mt-1" value={bookingData.guestCity} onChange={(e) => setBookingData({ ...bookingData, guestCity: e.target.value })} /></div>
                          <div>
                            <Label>District</Label>
                            <Select value={bookingData.guestDistrict} onValueChange={(value) => setBookingData({ ...bookingData, guestDistrict: value })}>
                              <SelectTrigger className="mt-1"><SelectValue placeholder="Select district" /></SelectTrigger>
                              <SelectContent>
                                {(districtOptions.length ? districtOptions : bookingData.guestDistrict ? [bookingData.guestDistrict] : []).map((district) => (
                                  <SelectItem key={district} value={district}>{district}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>State</Label>
                            <Select value={bookingData.guestState} onValueChange={(value) => setBookingData({ ...bookingData, guestState: value })}>
                              <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                              <SelectContent>
                                {indianStates.map((state) => (
                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" initial={false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="font-heading text-2xl font-semibold text-forest-800 dark:text-white mb-6">Add-on Services</h2>
                      <div className="space-y-4">
                        {['comfort', 'dining', 'celebration'].map(category => (
                          <div key={category}>
                            <h3 className="text-lg font-medium text-forest-800 dark:text-white mb-3 capitalize">{category}</h3>
                            <div className="space-y-2">
                              {addOns.filter(a => a.category === category).map(addon => {
                                const qty = bookingData.selectedAddOns.find(a => a.id === addon.id)?.quantity || 0;
                                return (
                                  <Card key={addon.id} className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div><p className="font-medium text-forest-800 dark:text-white">{addon.name}</p><p className="text-sm text-forest-600">₹{addon.price} {addon.unit}</p></div>
                                      <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAddOnChange(addon.id, Math.max(0, qty - 1))} disabled={qty === 0}><Minus className="w-4 h-4" /></Button>
                                        <span className="w-8 text-center font-medium">{qty}</span>
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAddOnChange(addon.id, qty + 1)}><Plus className="w-4 h-4" /></Button>
                                      </div>
                                    </div>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div key="step4" initial={false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="font-heading text-2xl font-semibold text-forest-800 dark:text-white mb-6">Review & Payment</h2>
                      <Card className="mb-6 bg-forest-50 dark:bg-forest-900/50">
                        <CardContent className="p-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-forest-600">Room Type</span><span className="font-medium">{selectedRoom?.name}</span></div>
                            <div className="flex justify-between"><span className="text-forest-600">Check-in</span><span>{formatDate(bookingData.checkIn)}</span></div>
                            <div className="flex justify-between"><span className="text-forest-600">Check-out</span><span>{formatDate(bookingData.checkOut)}</span></div>
                            <div className="flex justify-between"><span className="text-forest-600">Duration</span><span>{nights} nights</span></div>
                          </div>
                        </CardContent>
                      </Card>
                      <div className="mb-6">
                        <Label>Payment Method *</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          {['Pay at Hotel', 'Razorpay', 'Cash'].map(method => (
                            <Card key={method} className={`cursor-pointer p-3 ${bookingData.paymentMethod === method ? 'ring-2 ring-forest-600' : ''}`} onClick={() => setBookingData({ ...bookingData, paymentMethod: method })}>
                              <p className="text-center font-medium">{method}</p>
                            </Card>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mb-6">
                        <Checkbox id="terms" checked={bookingData.agreeTerms} onCheckedChange={(checked) => setBookingData({ ...bookingData, agreeTerms: checked as boolean })} />
                        <label htmlFor="terms" className="text-sm">I agree to the Terms & Conditions</label>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && bookingConfirmed && (
                    <motion.div key="step5" initial={false} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
                      <h2 className="font-heading text-3xl font-bold mb-2">Booking Confirmed!</h2>
                      <Card className="max-w-md mx-auto bg-forest-50 dark:bg-forest-900/50 mt-6">
                        <CardContent className="p-6">
                          <p className="text-sm text-forest-600 mb-1">Booking ID</p>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-2xl font-bold font-mono">{confirmedBookingId}</span>
                            <button onClick={() => { navigator.clipboard.writeText(confirmedBookingId); toast.success('Copied!'); }} className="p-1 hover:bg-forest-200 rounded"><Copy className="w-4 h-4" /></button>
                          </div>
                          <Separator className="mb-4" />
                          <div className="text-left space-y-2 text-sm">
                            <p><strong>Check-in:</strong> {formatDate(bookingData.checkIn)} at 2:00 PM</p>
                            <p><strong>Check-out:</strong> {formatDate(bookingData.checkOut)} at 11:00 AM</p>
                            <p><strong>Amount:</strong> ₹{grandTotal.toLocaleString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-2"><h3 className="font-heading text-lg font-semibold">Booking Summary</h3></CardHeader>
              <CardContent className="space-y-4">
                {selectedRoom && (
                  <>
                    <div className="flex justify-between text-sm"><span className="text-forest-600">{selectedRoom.name}</span><span>₹{selectedRoom.price.toLocaleString()}/night</span></div>
                    <div className="flex justify-between text-sm"><span className="text-forest-600">Nights</span><span>{nights}</span></div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between text-sm"><span className="text-forest-600">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-forest-600">GST (12%)</span><span>₹{taxAmount.toLocaleString()}</span></div>
                <Separator />
                <div className="flex justify-between"><span className="font-semibold">Total</span><span className="text-xl font-bold">₹{grandTotal.toLocaleString()}</span></div>
                {currentStep < 5 && (
                  <div className="flex gap-3 pt-4">
                    {currentStep > 1 && <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(prev => prev - 1)}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>}
                    <Button className="flex-1 bg-forest-600 hover:bg-forest-700" onClick={handleNextStep} disabled={isLoading}>{isLoading ? 'Processing...' : currentStep === 4 ? 'Confirm' : 'Continue'}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full"></div></div>}>
      <BookingContent />
    </Suspense>
  );
}
