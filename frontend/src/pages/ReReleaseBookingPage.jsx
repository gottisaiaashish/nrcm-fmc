import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, User, ChevronDown, Flame, Film, Ticket, Calendar, Clock, ArrowLeft, ShieldCheck, Check, Sparkles, CreditCard, ChevronRight, ChevronLeft, Hash, Phone, Mail, Camera, Utensils, Play, Pause, Volume2, VolumeX, Minus, Plus, Copy } from 'lucide-react';
import TicketPassModal from '../components/modals/TicketPassModal';
import SupportModal from '../components/modals/SupportModal';
import AdminLoginModal from '../components/modals/AdminLoginModal';
import AdminDashboardModal from '../components/modals/AdminDashboardModal';
import FindTicketModal from '../components/modals/FindTicketModal';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function ReReleaseBookingPage() {
  const navigate = useNavigate();

  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(() => {
    return localStorage.getItem('nrcmfmc_admin_dashboard_open') === 'true' && !!localStorage.getItem('nrcmfmc_admin_token');
  });
  const [findTicketOpen, setFindTicketOpen] = useState(false);

  // Active View State: 'spotlight' (District Home), 'seats' (Date, Time & Seat Matrix), 'checkout' (Student Details & Payment)
  const [activeView, setActiveView] = useState('spotlight');
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-redirect old domain visits to Razorpay Approved motionbook.vercel.app domain
    if (window.location.hostname.includes('nrcm-fmc-phi.vercel.app')) {
      const targetUrl = 'https://motionbook.vercel.app' + window.location.pathname + window.location.search;
      console.log('🔄 Redirecting to approved domain:', targetUrl);
      window.location.href = targetUrl;
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (activeView === 'seats' && videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay error:', err));
    }
  }, [activeView]);

  // Event Settings State
  const [eventSettings, setEventSettings] = useState({
    movieTitle: 'Businessman',
    tagline: 'Guns Don\'t Need Reasons, They Need Bullets!',
    description: 'Surya (Mahesh Babu) arrives in Mumbai to conquer the mafia underworld. A cult high-energy action entertainer directed by Puri Jagannadh.',
    posterUrl: 'https://tse3.mm.bing.net/th/id/OIP.Ws0jajMZU5CdOh0jDEgBEQHaKf?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    venue: 'NRCM Main Auditorium, MT Block',
    releaseDate: 'AUGUST 24, 2026',
    dates: ['AUGUST 24, 2026'],
    showTimes: ['10:00 AM to 12:30 PM', '01:00 PM to 03:30 PM'],
    tiers: [
      { id: 'vip', name: 'VIP Balcony', price: 150, description: 'Premium balcony seating with snack voucher', badge: 'Fast Filling' },
      { id: 'fanzone', name: 'Fan Zone', price: 120, description: 'Front rows stage area with high energy crowd', badge: 'Popular' },
      { id: 'general', name: 'General Student Pass', price: 99, description: 'Standard auditorium middle seating', badge: 'Available' }
    ],
    isBookingOpen: true
  });

  // Fetch Live Event Settings on Mount
  useEffect(() => {
    fetch('/api/event-settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setEventSettings(data.settings);
          if (data.settings.dates && data.settings.dates.length > 0) {
            setSelectedDate(data.settings.dates[0]);
          } else if (data.settings.releaseDate) {
            setSelectedDate(data.settings.releaseDate);
          }
          if (data.settings.showTimes && data.settings.showTimes.length > 0) {
            setSelectedShowTime(data.settings.showTimes[0]);
          }
        }
      })
      .catch(err => console.log('Error fetching event settings:', err));
  }, []);

  const [selectedCategoryTab, setSelectedCategoryTab] = useState('movies'); // 'movies' | 'events'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShowTime, setSelectedShowTime] = useState('10:00 AM to 12:30 PM');
  const [selectedDate, setSelectedDate] = useState('AUGUST 24, 2026');
  const [availability, setAvailability] = useState({});
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(['B4']);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // Dynamic Multi-Student Form State (1 student object per ticket)
  const [studentsData, setStudentsData] = useState([
    { studentName: '', rollNo: '', branchName: '', yearName: '', branch: '', mobile: '', email: '' }
  ]);

  // Sync studentsData array length with ticketQuantity automatically
  useEffect(() => {
    setStudentsData(prev => {
      if (prev.length === ticketQuantity) return prev;
      if (prev.length < ticketQuantity) {
        const added = Array.from({ length: ticketQuantity - prev.length }, (_, i) => ({
          studentName: '',
          rollNo: '',
          branchName: prev[0]?.branchName || '',
          yearName: prev[0]?.yearName || '',
          branch: prev[0]?.branch || '',
          mobile: prev[0]?.mobile || '',
          email: prev[0]?.email || ''
        }));
        return [...prev, ...added];
      } else {
        return prev.slice(0, ticketQuantity);
      }
    });
  }, [ticketQuantity]);

  const handleStudentInputChange = (index, field, value) => {
    setStudentsData(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const copyStudent1Contact = (index) => {
    setStudentsData(prev => {
      const copy = [...prev];
      const primary = copy[0];
      copy[index] = {
        ...copy[index],
        branch: primary.branch || copy[index].branch,
        mobile: primary.mobile || copy[index].mobile,
        email: primary.email || copy[index].email
      };
      return copy;
    });
  };

  // Accordion Expand/Collapse State (Student 1 expanded by default)
  const [expandedStudentIndexes, setExpandedStudentIndexes] = useState([0]);

  const toggleStudentAccordion = (index) => {
    setExpandedStudentIndexes(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showRewindAnimation, setShowRewindAnimation] = useState(false);
  const [showForwardAnimation, setShowForwardAnimation] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const lastTapRef = useRef({ time: 0, x: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoContainerClick = (e) => {
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (now - lastTapRef.current.time < 320) {
      // Double tap detected!
      if (clickX < width * 0.45) {
        // Double tap LEFT (-10s)
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
        setShowRewindAnimation(true);
        setTimeout(() => setShowRewindAnimation(false), 700);
      } else if (clickX > width * 0.55) {
        // Double tap RIGHT (+10s)
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 10);
        }
        setShowForwardAnimation(true);
        setTimeout(() => setShowForwardAnimation(false), 700);
      } else {
        togglePlayPause();
      }
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      lastTapRef.current = { time: now, x: clickX };
      setTimeout(() => {
        if (lastTapRef.current.time === now) {
          togglePlayPause();
        }
      }, 320);
    }
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [bookingSuccessModalOpen, setBookingSuccessModalOpen] = useState(false);
  const [generatedTickets, setGeneratedTickets] = useState([]);
  const [bookingRef, setBookingRef] = useState('');
  const [eventSuggestionText, setEventSuggestionText] = useState('');
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);

  const campusHighlights = [
    {
      id: 1,
      icon: <Mail size={20} color="#2563eb" />,
      bg: 'rgba(37, 99, 235, 0.1)',
      title: 'Email Digital Pass',
      subtitle: 'Sent to Registered Email ID'
    },
    {
      id: 2,
      icon: <ShieldCheck size={20} color="#16a34a" />,
      bg: 'rgba(22, 163, 74, 0.1)',
      title: 'Single-Use QR Pass',
      subtitle: 'Instant Gate QR Scanning'
    },
    {
      id: 3,
      icon: <Ticket size={20} color="#ca8a04" />,
      bg: 'rgba(202, 138, 4, 0.1)',
      title: 'Digital Ticket Pass',
      subtitle: 'Instant Online Access Pass'
    },
    {
      id: 4,
      icon: <Clock size={20} color="#e11d48" />,
      bg: 'rgba(225, 29, 72, 0.1)',
      title: 'Gates Open Early',
      subtitle: '15 Mins Before Show Time'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHighlightIndex((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleSendSuggestion = async (textToSend) => {
    const text = textToSend || eventSuggestionText;
    if (!text || !text.trim()) return;
    setEventSuggestionText(text);
    setSuggestionSubmitted(true);

    try {
      await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() })
      });
    } catch (err) {
      console.error('Error submitting suggestion:', err);
    }
  };

  // Load Event Settings
  useEffect(() => {
    fetch('/api/event-settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setEventSettings(prev => ({
            ...prev,
            ...data.settings,
            isBookingOpen: true,
            movieTitle: 'Businessman',
            posterUrl: 'https://tse3.mm.bing.net/th/id/OIP.Ws0jajMZU5CdOh0jDEgBEQHaKf?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
          }));
          if (data.settings.tiers && data.settings.tiers.length > 0) {
            setSelectedTier(data.settings.tiers[0]);
          }
          if (data.settings.showTimes && data.settings.showTimes.length > 0) {
            setSelectedShowTime(data.settings.showTimes[0]);
          }
        }
      })
      .catch(err => console.error('Failed to load event settings:', err));

    const loadAvailability = () => {
      fetch(`${API_BASE}/api/tickets/availability`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.availability) {
            setAvailability(data.availability);
          }
        })
        .catch(err => console.error('Failed to load availability:', err));
    };

    loadAvailability();
    const interval = setInterval(loadAvailability, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSeatToggle = (seatCode) => {
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      if (selectedSeats.length >= 10) return;
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDoneBooking = () => {
    setBookingSuccessModalOpen(false);
    setTicketQuantity(1);
    setStudentsData([
      { studentName: '', rollNo: '', branchName: '', yearName: '', branch: '', mobile: '', email: '' }
    ]);
    setActiveView('spotlight');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate ALL Students for complete verification details
    for (let i = 0; i < studentsData.length; i++) {
      const s = studentsData[i] || {};
      if (!s.studentName || !s.studentName.trim() || !s.rollNo || !s.rollNo.trim() || !s.branch || !s.branch.trim() || !s.mobile || !s.mobile.trim() || !s.email || !s.email.trim()) {
        setErrorMessage(`Please complete all 5 verification fields (Name, Roll No, Branch, Mobile, Email) for Student ${i + 1}.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const subtotal = 50 * ticketQuantity;
      const convenienceFee = 3 * ticketQuantity;
      const totalAmount = subtotal + convenienceFee;
      const primaryStudent = studentsData[0];

      const orderResp = await fetch(`${API_BASE}/api/tickets/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          tierName: 'General Pass',
          quantity: ticketQuantity,
          studentName: primaryStudent.studentName,
          rollNo: primaryStudent.rollNo
        })
      });

      if (!orderResp.ok) {
        throw new Error('Payment server connection failed. Please try again in a moment.');
      }

      const orderData = await orderResp.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate payment.');
      }

      const bookingPayload = {
        studentName: primaryStudent.studentName,
        rollNo: primaryStudent.rollNo,
        branch: primaryStudent.branch,
        mobile: primaryStudent.mobile,
        email: primaryStudent.email,
        studentsData: studentsData,
        movieTitle: eventSettings.movieTitle,
        showTime: selectedShowTime,
        tierName: 'General Pass',
        price: 50,
        quantity: ticketQuantity
      };

      if (orderData.isMock) {
        const verifyResp = await fetch(`${API_BASE}/api/tickets/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_district_white_${Date.now()}`,
            razorpay_signature: 'mock_signature',
            bookingData: bookingPayload
          })
        });

        if (!verifyResp.ok) {
          throw new Error('Payment verification server failed.');
        }

        const verifyData = await verifyResp.json();
        if (verifyData.success) {
          setGeneratedTickets(verifyData.tickets);
          setBookingRef(verifyData.bookingRef);
          setBookingSuccessModalOpen(true);
        } else {
          throw new Error(verifyData.error || 'Payment verification failed.');
        }
        setIsSubmitting(false);
        return;
      }

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) throw new Error('Razorpay payment gateway failed to load. Check your internet connection.');

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NRCM FilmMaking Club',
        description: `${eventSettings.movieTitle} (${ticketQuantity} Pass${ticketQuantity > 1 ? 'es' : ''})`,
        order_id: orderData.orderId,
        prefill: { name: primaryStudent.studentName, email: primaryStudent.email, contact: primaryStudent.mobile },
        theme: { color: '#e11d48' },
        handler: async function (response) {
          try {
            console.log('💳 Payment completed on Razorpay popup:', response);
            const verifyResp = await fetch(`${API_BASE}/api/tickets/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: bookingPayload
              })
            });

            let verifyData;
            try {
              verifyData = await verifyResp.json();
            } catch (_) {}

            if (verifyData && verifyData.success) {
              setGeneratedTickets(verifyData.tickets);
              setBookingRef(verifyData.bookingRef);
              setBookingSuccessModalOpen(true);
            } else {
              const fallbackTickets = studentsData.map((st, i) => ({
                ticketId: `NRCM-TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${i + 1}`,
                studentName: st.studentName || primaryStudent.studentName,
                rollNo: st.rollNo || primaryStudent.rollNo,
                branch: st.branch || primaryStudent.branch,
                mobile: st.mobile || primaryStudent.mobile,
                email: st.email || primaryStudent.email,
                movieTitle: eventSettings.movieTitle,
                showTime: selectedShowTime,
                tierName: 'General Pass',
                price: 50,
                bookingRef: `NRCM-BKG-${Date.now().toString().slice(-6)}`,
                paymentId: response.razorpay_payment_id
              }));
              setGeneratedTickets(fallbackTickets);
              setBookingRef(`NRCM-BKG-${Date.now().toString().slice(-6)}`);
              setBookingSuccessModalOpen(true);
            }
          } catch (err) {
            console.error('Verification error:', err);
            const fallbackTickets = studentsData.map((st, i) => ({
              ticketId: `NRCM-TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${i + 1}`,
              studentName: st.studentName || primaryStudent.studentName,
              rollNo: st.rollNo || primaryStudent.rollNo,
              branch: st.branch || primaryStudent.branch,
              mobile: st.mobile || primaryStudent.mobile,
              email: st.email || primaryStudent.email,
              movieTitle: eventSettings.movieTitle,
              showTime: selectedShowTime,
              tierName: 'General Pass',
              price: 50,
              bookingRef: `NRCM-BKG-${Date.now().toString().slice(-6)}`,
              paymentId: response.razorpay_payment_id
            }));
            setGeneratedTickets(fallbackTickets);
            setBookingRef(`NRCM-BKG-${Date.now().toString().slice(-6)}`);
            setBookingSuccessModalOpen(true);
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.error(resp.error);
        setErrorMessage(resp.error.description || 'Payment was cancelled or failed.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      const userFriendlyMsg = err.message && !err.message.includes('Unexpected') && !err.message.includes('json')
        ? err.message
        : 'Payment service temporarily unavailable. Please try again shortly.';
      setErrorMessage(userFriendlyMsg);
      setIsSubmitting(false);
    }
  };

  const calculatedTotal = (selectedTier ? selectedTier.price : 0) * selectedSeats.length;

  // Pure Clean White Style System
  const S = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#0f172a',
      fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
      paddingBottom: '100px'
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '14px 20px'
    },
    container: {
      maxWidth: '480px',
      margin: '0 auto',
      padding: '16px 16px 0'
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    },
    inputWrap: {
      position: 'relative',
      marginBottom: '14px'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '18px',
      height: '18px',
      color: '#64748b',
      pointerEvents: 'none'
    },
    input: {
      width: '100%',
      height: '48px',
      paddingLeft: '48px',
      paddingRight: '16px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      color: '#0f172a',
      fontSize: '14px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      outline: 'none',
      boxSizing: 'border-box'
    }
  };

  return (
    <div className="district-font" style={S.page}>

      {/* Pure White Top Header */}
      <header style={S.header}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Location Pin & FMC Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} color="#0f172a" />
              </div>
              <div>
                <strong style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  NRCM Main Auditorium <ChevronDown size={16} color="#64748b" />
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>MT Block • Hyderabad</span>
              </div>
            </div>

            <img
              src="/nrcm_fmc_logo.png"
              alt="NRCM FMC Logo"
              onClick={() => setAdminLoginOpen(true)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                objectFit: 'cover',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              title="NRCM FMC - Admin Portal"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={S.container}>

        {/* SCREEN 1: SPOTLIGHT HOME SCREEN */}
        {activeView === 'spotlight' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Category Cards (Clean Soft Border Layout) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div
                onClick={() => setSelectedCategoryTab('movies')}
                style={{
                  height: '56px',
                  padding: '0 18px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Movies</span>
                <Film size={22} color="#2563eb" style={{ flexShrink: 0, marginLeft: '8px' }} />
              </div>

              <div
                onClick={() => setSelectedCategoryTab('events')}
                style={{
                  height: '56px',
                  padding: '0 18px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Events</span>
                <Ticket size={22} color="#ca8a04" style={{ flexShrink: 0, marginLeft: '8px' }} />
              </div>
            </div>

            {/* MOVIES TAB VIEW */}
            {selectedCategoryTab === 'movies' && (
              <>
                {searchQuery.trim() !== '' && !('businessman'.includes(searchQuery.toLowerCase().trim()) || 'movies'.includes(searchQuery.toLowerCase().trim()) || 're-release'.includes(searchQuery.toLowerCase().trim()) || (eventSettings.movieTitle && eventSettings.movieTitle.toLowerCase().includes(searchQuery.toLowerCase().trim()))) ? (
                  <div style={{ ...S.card, padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', borderRadius: '22px' }}>
                    <Search size={32} color="#64748b" />
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                        No results found for "{searchQuery}"
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                        Try searching for <strong>"Businessman"</strong>, <strong>"Movies"</strong>, or <strong>"Re-Release"</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ padding: '10px 20px', borderRadius: '12px', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <>
                    {/* "In the spotlight" Section */}
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0' }}>
                        In the spotlight
                      </h2>

                  {/* Clean White Movie Poster Card */}
                  {!eventSettings.movieTitle ? (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                      <Film size={36} color="#64748b" style={{ marginBottom: '12px' }} />
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                        No Active Movie Screening
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                        Currently there is no live movie screening scheduled. Stay tuned for upcoming movie re-release announcements!
                      </p>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                      
                      <div style={{ width: '100%', height: '320px', position: 'relative', backgroundColor: '#0f172a' }}>
                        <img
                          src={eventSettings.posterUrl}
                          alt={eventSettings.movieTitle}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                        />
                      </div>

                      {/* Description under Poster */}
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                          {eventSettings.movieTitle}
                        </h3>
                        {eventSettings.tagline && (
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#e11d48', display: 'block', marginBottom: '8px' }}>
                            {eventSettings.tagline}
                          </span>
                        )}
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                          {eventSettings.description}
                        </p>

                      <button
                        onClick={() => {
                          if (!eventSettings.isBookingOpen) {
                            alert('Bookings Opening Soon! Online ticket pass bookings will open shortly. Stay tuned!');
                            return;
                          }
                          setActiveView('seats');
                        }}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '14px',
                          backgroundColor: eventSettings.isBookingOpen ? '#e11d48' : '#0f172a',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 800,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          gap: '8px',
                          boxShadow: eventSettings.isBookingOpen ? '0 4px 12px rgba(225, 29, 72, 0.3)' : '0 4px 12px rgba(15, 23, 42, 0.2)'
                        }}
                      >
                        {eventSettings.isBookingOpen ? <Ticket size={18} /> : <Clock size={18} />}
                        <span>{eventSettings.isBookingOpen ? 'Book Now' : 'Booking Will Be Open Soon'}</span>
                      </button>
                    </div>

                  </div>
                  )}
                </div>

                {/* Auto-cycling Highlight Loop (Pure Borderless Layout) */}
                <div style={{ padding: '12px 4px', margin: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    {/* Active Dot Indicators */}
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {campusHighlights.map((_, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveHighlightIndex(idx)}
                          style={{
                            width: idx === activeHighlightIndex ? '16px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            backgroundColor: idx === activeHighlightIndex ? '#0f172a' : '#cbd5e1',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active 1-by-1 Highlight Card */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minHeight: '46px', transition: 'all 0.3s ease' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: campusHighlights[activeHighlightIndex].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {campusHighlights[activeHighlightIndex].icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', fontWeight: 800 }}>
                        {campusHighlights[activeHighlightIndex].title}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                        {campusHighlights[activeHighlightIndex].subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Already Booked / Forgot to Download Ticket Card */}
                <div style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', gap: '12px', padding: '16px 18px', borderRadius: '18px', marginBottom: '12px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', fontWeight: 800 }}>Forgot to Download Ticket?</strong>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Retrieve your pass using Roll No or Phone</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFindTicketOpen(true)}
                    style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#e11d48', color: '#ffffff', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(225,29,72,0.25)', whiteSpace: 'nowrap' }}
                  >
                    Find Ticket
                  </button>
                </div>

                {/* Need Helpdesk Support */}
                <div style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', gap: '12px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>Need Help with Booking?</strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>NRCM Film Making Club Helpdesk • MT Block</span>
                  </div>
                  <button
                    onClick={() => navigate('/support')}
                    style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 }}
                  >
                    Support
                  </button>
                </div>
              </>
            )}
          </>
        )}

            {/* EVENTS TAB VIEW */}
            {selectedCategoryTab === 'events' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Clean Modern No Upcoming Events Header Card */}
                <div style={{ ...S.card, padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderRadius: '22px' }}>
                  <Calendar size={36} color="#ca8a04" />
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                      No Live Events Right Now
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
                      NRCM Film Making Club is currently focusing on the <strong>Businessman Re-Release</strong> screening in MT Block Auditorium! New workshops & events will be announced soon.
                    </p>
                  </div>
                </div>

                {/* Interactive Event Suggestions Box */}
                <div style={{ ...S.card, borderRadius: '22px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <Flame size={20} color="#e11d48" />
                    <div>
                      <strong style={{ fontSize: '15px', color: '#0f172a', display: 'block' }}>Suggest an Event for FMC Campus</strong>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>What movie or event would you like NRCM FMC to host next?</span>
                    </div>
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {[
                      '🎬 Short Film Competition',
                      '📸 Photography Workshop',
                      '🎤 Campus Open Mic Night',
                      '🍿 Pokiri Re-Release',
                      '🔥 Okkadu Cult Screening'
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSendSuggestion(chip)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '20px',
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Suggestion Form Input */}
                  {!suggestionSubmitted ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Type your event or movie suggestion..."
                        value={eventSuggestionText}
                        onChange={(e) => setEventSuggestionText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendSuggestion(eventSuggestionText);
                        }}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => handleSendSuggestion(eventSuggestionText)}
                        style={{
                          padding: '0 20px',
                          borderRadius: '12px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Check size={18} color="#16a34a" />
                        <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 700 }}>
                          Thank you! Your suggestion "{eventSuggestionText}" has been sent to NRCM FMC Team! 🚀
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEventSuggestionText('');
                          setSuggestionSubmitted(false);
                        }}
                        style={{ background: 'none', border: 'none', color: '#15803d', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Suggest another
                      </button>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* SCREEN 2: TRAILER, DATE, SHOWTIME & TICKET QUANTITY */}
        {activeView === 'seats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Header with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setActiveView('spotlight')} style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer' }}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{eventSettings.movieTitle}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>NRCM Main Auditorium • MT Block</span>
              </div>
            </div>

            {/* Pure Clean Zoomed Theater Trailer Player (YouTube Style Double-Tap Seek Gestures) */}
            <div
              onClick={handleVideoContainerClick}
              style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: '18px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                width: '100%',
                aspectRatio: '2.1/1',
                backgroundColor: '#000000',
                position: 'relative',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <video
                key="businessman-theater-trailer-zoomed-perfect-v8"
                ref={videoRef}
                autoPlay
                loop
                playsInline
                poster="https://tse3.mm.bing.net/th/id/OIP.Ws0jajMZU5CdOh0jDEgBEQHaKf?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scale(1.32)',
                  objectPosition: 'center center',
                  display: 'block',
                  borderRadius: '18px'
                }}
              >
                <source src="/businessman_trailer.mp4?v=1" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>

              {/* YouTube Style Double-Tap Left Rewind Flash Animation (-10s) */}
              {showRewindAnimation && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '15%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    color: '#ffffff',
                    zIndex: 20,
                    pointerEvents: 'none'
                  }}
                >
                  <ChevronLeft size={28} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.9)', marginTop: '2px' }}>-10 SEC</span>
                </div>
              )}

              {/* YouTube Style Double-Tap Right Forward Flash Animation (+10s) */}
              {showForwardAnimation && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '15%',
                    transform: 'translate(50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    color: '#ffffff',
                    zIndex: 20,
                    pointerEvents: 'none'
                  }}
                >
                  <ChevronRight size={28} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.9)', marginTop: '2px' }}>+10 SEC</span>
                </div>
              )}

              {/* Pure Play Symbol Icon in Center (ONLY when paused - ZERO background circle) */}
              {!isPlaying && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}
                >
                  <Play size={26} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.85))', marginLeft: '3px' }} />
                </div>
              )}
              {/* Pure Audio Icon Symbol (Zero Background, Zero Text) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                    setIsMuted(videoRef.current.muted);
                  }
                }}
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <VolumeX size={20} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
                ) : (
                  <Volume2 size={20} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
                )}
              </button>
            </div>

            {/* BookMyShow / Zomato District Style Title, About & Cast & Crew Section */}
            <div style={{ padding: '4px 4px 12px 4px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                Businessman
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '10px' }}>
                <span>UA</span>
                <span>•</span>
                <span>Telugu</span>
                <span>•</span>
                <span>2h 12m</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 700 }}>
                  Action
                </span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 700 }}>
                  Crime
                </span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 700 }}>
                  Thriller
                </span>
              </div>

              <span style={{ fontSize: '13px', color: '#64748b', display: 'block', fontWeight: 500, marginBottom: '20px' }}>
                Released 13 January 2012
              </span>

              {/* SHOW DATE & TIME SELECTION SECTION */}
              <div style={{ marginBottom: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={18} color="#e11d48" />
                    <span>Select Show Date & Time</span>
                  </h2>
                </div>

                {/* 1. DATE SELECTOR PILLS */}
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>1. Select Screening Date</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {(eventSettings.dates && eventSettings.dates.length > 0 ? eventSettings.dates : [eventSettings.releaseDate || 'AUGUST 24, 2026']).map((d) => {
                    const isSelected = selectedDate === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '14px',
                          backgroundColor: isSelected ? '#0f172a' : '#f8fafc',
                          color: isSelected ? '#ffffff' : '#0f172a',
                          border: isSelected ? '2px solid #0f172a' : '1px solid #cbd5e1',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 4px 12px rgba(15,23,42,0.2)' : 'none'
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                {/* 2. SHOW TIME SELECTOR PILLS */}
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>2. Select Show Timing</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(eventSettings.showTimes && eventSettings.showTimes.length > 0 ? eventSettings.showTimes : ['10:00 AM to 12:30 PM', '01:00 PM to 03:30 PM']).map((st) => {
                    const timeString = typeof st === 'string' ? st : (st.time || st);
                    const isSelected = selectedShowTime === timeString;
                    const slotData = availability[selectedDate]?.[timeString] || { booked: 0, capacity: 300, remaining: 300, isHousefull: false };
                    const isHousefull = slotData.isHousefull || slotData.remaining <= 0;

                    return (
                      <div
                        key={timeString}
                        onClick={() => !isHousefull && setSelectedShowTime(timeString)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '14px',
                          backgroundColor: isHousefull ? '#fef2f2' : (isSelected ? '#fff1f2' : '#f8fafc'),
                          border: isHousefull ? '1.5px solid #fecaca' : (isSelected ? '2px solid #e11d48' : '1px solid #cbd5e1'),
                          cursor: isHousefull ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          opacity: isHousefull ? 0.8 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: isHousefull ? '#991b1b' : (isSelected ? '#be123c' : '#0f172a') }}>
                            {timeString}
                          </div>
                        </div>

                        {isHousefull && (
                          <span style={{ fontSize: '11px', fontWeight: 900, backgroundColor: '#dc2626', color: '#ffffff', padding: '5px 12px', borderRadius: '12px', letterSpacing: '0.5px' }}>
                            HOUSEFULL
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* About Section */}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                  About
                </h2>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0, fontWeight: 400 }}>
                  Surya (Mahesh Babu) arrives in Mumbai with a ruthless ambition to conquer the underworld and turn crime into an organized business empire. Armed with sheer grit, strategy, and unshakeable confidence, he rises to power while winning the heart of Chitra.
                </p>
              </div>

              {/* Cast & Crew Section */}
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0' }}>
                  Cast & Crew
                </h2>

                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                  {[
                    { name: 'Mahesh Babu', role: 'Surya', img: '/cast/mahesh.jpg?v=3' },
                    { name: 'Kajal Aggarwal', role: 'Chitra', img: '/cast/kajal.jpg?v=3' },
                    { name: 'Puri Jagannadh', role: 'Director', img: '/cast/puri.jpg?v=3' },
                    { name: 'S. Thaman', role: 'Music Director', img: '/cast/thaman.jpg?v=3' },
                    { name: 'Prakash Raj', role: 'Jaidev', img: '/cast/prakash_raj.jpg?v=3' },
                    { name: 'Nassar', role: 'Ajay Bhardwaj', img: '/cast/nassar.jpg?v=3' }
                  ].map((person, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '92px', textAlign: 'center' }}>
                      <img
                        src={person.img}
                        alt={person.name}
                        style={{ width: '74px', height: '74px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px', border: '2px solid #e2e8f0', boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', lineHeight: '1.2', marginBottom: '2px' }}>
                        {person.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, display: 'block' }}>
                        {person.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll-Activated Floating Bottom Bar */}
            <div
              style={{
                position: 'fixed',
                bottom: '16px',
                left: '50%',
                transform: showStickyBar ? 'translate(-50%, 0)' : 'translate(-50%, 120%)',
                width: 'calc(100% - 32px)',
                maxWidth: '440px',
                zIndex: 1000,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                boxShadow: '0 12px 35px rgba(15, 23, 42, 0.14)',
                opacity: showStickyBar ? 1 : 0,
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: showStickyBar ? 'auto' : 'none',
                boxSizing: 'border-box'
              }}
            >
              {/* 1. FAR LEFT: Selected Label & Total Price */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, lineHeight: 1.2 }}>
                  Selected
                </span>
                <strong style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginTop: '2px' }}>
                  ₹{ticketQuantity * 50}
                </strong>
              </div>

              {/* 2. RIGHT GROUP: Quantity Pill + Proceed Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>
                {/* Minimalist Quantity Counter [-] count [+] (No Background) */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '8px',
                    padding: '0 4px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setTicketQuantity(prev => Math.max(1, prev - 1))}
                    disabled={ticketQuantity <= 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: ticketQuantity <= 1 ? '#cbd5e1' : '#0f172a',
                      cursor: ticketQuantity <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      padding: 0,
                      margin: 0
                    }}
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>
                  
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', minWidth: '14px', textAlign: 'center', lineHeight: 1 }}>
                    {ticketQuantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setTicketQuantity(prev => Math.min(10, prev + 1))}
                    disabled={ticketQuantity >= 10}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: ticketQuantity >= 10 ? '#cbd5e1' : '#0f172a',
                      cursor: ticketQuantity >= 10 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      padding: 0,
                      margin: 0
                    }}
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>

                {/* ABSOLUTE FAR RIGHT: Proceed Black Pill Button */}
                <button
                  type="button"
                  onClick={() => {
                    const slotData = availability[selectedDate]?.[selectedShowTime] || { remaining: 300, isHousefull: false };
                    if (slotData.isHousefull || slotData.remaining <= 0) {
                      alert(`HOUSEFULL! The show on ${selectedDate} (${selectedShowTime}) has reached maximum capacity of 300 seats. Please choose another show time.`);
                      return;
                    }
                    if (ticketQuantity > slotData.remaining) {
                      alert(`Only ${slotData.remaining} seats remaining for this show time! Please reduce ticket quantity.`);
                      return;
                    }
                    setActiveView('checkout');
                  }}
                  disabled={availability[selectedDate]?.[selectedShowTime]?.isHousefull}
                  style={{
                    flexShrink: 0,
                    padding: '11px 22px',
                    borderRadius: '16px',
                    backgroundColor: availability[selectedDate]?.[selectedShowTime]?.isHousefull ? '#94a3b8' : '#0f172a',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: availability[selectedDate]?.[selectedShowTime]?.isHousefull ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {availability[selectedDate]?.[selectedShowTime]?.isHousefull ? 'Housefull' : 'Proceed'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* SCREEN 3: CHECKOUT & PAYMENT */}
        {activeView === 'checkout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setActiveView('seats')} style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer' }}>
                <ArrowLeft size={20} />
              </button>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Student Verification & Payment</h3>
            </div>

            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Accordion Collapsible Student Details Cards */}
              {studentsData.map((student, idx) => {
                const isExpanded = expandedStudentIndexes.includes(idx);
                const isComplete = student.studentName && student.rollNo && student.branch && student.mobile && student.email;

                return (
                  <div key={`student-accordion-${idx}`} style={S.card}>
                    {/* Accordion Header */}
                    <div
                      onClick={() => toggleStudentAccordion(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none',
                        paddingBottom: isExpanded ? '14px' : '0px',
                        borderBottom: isExpanded ? '1px dashed #e2e8f0' : 'none',
                        marginBottom: isExpanded ? '14px' : '0px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#0f172a" />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                          STUDENT {idx + 1} DETAILS
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                        <span style={{ color: '#64748b', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', display: 'flex', alignItems: 'center' }}>
                          <ChevronDown size={18} />
                        </span>
                      </div>
                    </div>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={S.inputWrap}>
                          <User style={S.inputIcon} />
                          <input
                            type="text"
                            required
                            value={student.studentName}
                            onChange={(e) => handleStudentInputChange(idx, 'studentName', e.target.value)}
                            placeholder={`Student ${idx + 1} Full Name *`}
                            style={S.input}
                          />
                        </div>

                        <div style={S.inputWrap}>
                          <Hash style={S.inputIcon} />
                          <input
                            type="text"
                            required
                            value={student.rollNo}
                            onChange={(e) => handleStudentInputChange(idx, 'rollNo', e.target.value)}
                            placeholder={`Student ${idx + 1} Roll Number *`}
                            style={{ ...S.input, fontFamily: 'monospace', textTransform: 'uppercase' }}
                          />
                        </div>

                        {/* Branch & Year Dropdown Selection */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                          <div style={{ ...S.inputWrap, margin: 0 }}>
                            <select
                              required
                              value={student.branchName || ''}
                              onChange={(e) => {
                                const newBranch = e.target.value;
                                handleStudentInputChange(idx, 'branchName', newBranch);
                                const combined = `${newBranch}${student.yearName ? ' - ' + student.yearName : ''}`;
                                handleStudentInputChange(idx, 'branch', combined);
                              }}
                              style={{
                                ...S.input,
                                paddingLeft: '14px',
                                paddingRight: '32px',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                backgroundColor: '#ffffff',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: student.branchName ? '#0f172a' : '#94a3b8'
                              }}
                            >
                              <option value="" disabled>Branch *</option>
                              <option value="CSE">CSE</option>
                              <option value="CSE (AI & ML)">CSE (AI & ML)</option>
                              <option value="CSE (Data Science)">CSE (Data Science)</option>
                              <option value="CSE (Cyber Security)">CSE (Cyber Security)</option>
                              <option value="ECE">ECE</option>
                              <option value="EEE">EEE</option>
                              <option value="IT">IT</option>
                              <option value="MECH">MECH</option>
                              <option value="CIVIL">CIVIL</option>
                              <option value="MBA / M.Tech">MBA / M.Tech</option>
                            </select>
                            <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} size={16} />
                          </div>

                          <div style={{ ...S.inputWrap, margin: 0 }}>
                            <select
                              required
                              value={student.yearName || ''}
                              onChange={(e) => {
                                const newYear = e.target.value;
                                handleStudentInputChange(idx, 'yearName', newYear);
                                const combined = `${student.branchName || ''}${newYear ? ' - ' + newYear : ''}`;
                                handleStudentInputChange(idx, 'branch', combined);
                              }}
                              style={{
                                ...S.input,
                                paddingLeft: '14px',
                                paddingRight: '32px',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                backgroundColor: '#ffffff',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: student.yearName ? '#0f172a' : '#94a3b8'
                              }}
                            >
                              <option value="" disabled>Year *</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                            </select>
                            <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} size={16} />
                          </div>
                        </div>

                        <div style={S.inputWrap}>
                          <Phone style={S.inputIcon} />
                          <input
                            type="tel"
                            required
                            value={student.mobile}
                            onChange={(e) => handleStudentInputChange(idx, 'mobile', e.target.value)}
                            placeholder={`Student ${idx + 1} Mobile / WhatsApp Number *`}
                            style={S.input}
                          />
                        </div>

                        <div style={S.inputWrap}>
                          <Mail style={S.inputIcon} />
                          <input
                            type="email"
                            required
                            value={student.email}
                            onChange={(e) => handleStudentInputChange(idx, 'email', e.target.value)}
                            placeholder={`Student ${idx + 1} Email Address *`}
                            style={S.input}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Order Summary & Pay */}
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  <span>Movie & Time:</span>
                  <strong style={{ color: '#0f172a' }}>{eventSettings.movieTitle} ({selectedShowTime})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  <span>Ticket Price ({ticketQuantity} Ticket{ticketQuantity > 1 ? 's' : ''}):</span>
                  <strong style={{ color: '#0f172a' }}>₹{ticketQuantity * 50}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                  <span>Convenience Fee (Razorpay PG + GST):</span>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>+₹{ticketQuantity * 3}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>TOTAL AMOUNT:</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#e11d48' }}>₹{ticketQuantity * 53}</span>
                </div>

                {errorMessage && (
                  <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600, marginTop: '12px', textAlign: 'center' }}>
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)'
                  }}
                >
                  <CreditCard size={18} />
                  <span>{isSubmitting ? 'Processing Payment...' : `Pay ₹${ticketQuantity * 53}`}</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* Support Helpdesk Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      {/* Ticket Pass Modal */}
      <TicketPassModal
        isOpen={bookingSuccessModalOpen}
        onClose={handleDoneBooking}
        tickets={generatedTickets}
        bookingRef={bookingRef}
      />

      {/* Admin Credentials Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={() => {
          localStorage.setItem('nrcmfmc_admin_dashboard_open', 'true');
          setAdminLoginOpen(false);
          setAdminDashboardOpen(true);
        }}
      />

      {/* Admin Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminDashboardOpen}
        onClose={() => {
          localStorage.setItem('nrcmfmc_admin_dashboard_open', 'false');
          setAdminDashboardOpen(false);
        }}
        onLogout={() => {
          localStorage.removeItem('nrcmfmc_admin_token');
          localStorage.removeItem('nrcmfmc_admin_dashboard_open');
          localStorage.removeItem('nrcmfmc_admin_active_tab');
          setAdminDashboardOpen(false);
        }}
      />

      {/* Find & Download Ticket Pass Modal */}
      <FindTicketModal
        isOpen={findTicketOpen}
        onClose={() => setFindTicketOpen(false)}
        onTicketsFound={(foundTickets) => {
          setGeneratedTickets(foundTickets);
          setBookingRef(foundTickets[0]?.bookingRef || '');
          setBookingSuccessModalOpen(true);
        }}
      />

    </div>
  );
}
