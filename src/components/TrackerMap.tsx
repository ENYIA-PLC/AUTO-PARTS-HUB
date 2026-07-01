import React, { useEffect, useState, useRef } from 'react';
import { Map, Package, MapPin, Truck, CheckCircle2, Crosshair, Search, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { TrackOrderModal } from './TrackOrderModal';
import { io } from 'socket.io-client';
import { APIProvider, Map as GMap, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY';

function RouteDisplay({ origin, destination }: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;
    
    // Clear previous route
    polylinesRef.current.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin: { location: { lat: origin.lat, lng: origin.lng } },
      destination: { location: { lat: destination.lat, lng: destination.lng } },
      travelMode: 'DRIVING',
      routingPreference: 'TRAFFIC_AWARE',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({ strokeColor: '#f59e0b', strokeOpacity: 0.8, strokeWeight: 5 });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;
      }
    }).catch(err => console.error("Route computing failed:", err));

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin, destination]);

  return null;
}

export const TrackerMap = () => {
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [findingLocation, setFindingLocation] = useState(false);
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
    
    // Live backend tracking data state
    const [liveData, setLiveData] = useState<{
        courierLocation: {lat: number, lng: number} | null,
        etaMins: number | null,
        status: string
    }>({ courierLocation: null, etaMins: null, status: 'In Transit' });

    useEffect(() => {
        // Initialize WebSocket connection for live Geolocation updates
        const socket = io();

        socket.on("connect", () => {
            console.log("Connected to live tracking socket");
            // Join specific simulated order tracking room
            socket.emit("join-tracking", "PH-99214"); 
        });

        socket.on("location_update", (data: any) => {
            console.log("Received live tracker broadcast:", data);
            setLiveData(prev => ({
                ...prev,
                courierLocation: { lat: data.lat, lng: data.lng },
                etaMins: data.etaMins,
                status: data.status
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleLocateMe = () => {
        setFindingLocation(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setFindingLocation(false);
                },
                (error) => {
                    console.error("Error obtaining geolocation", error);
                    setFindingLocation(false);
                }
            );
        } else {
            setFindingLocation(false);
        }
    };

    // Simulated default positions if no live data
    const defaultCourierLocation = liveData.courierLocation || { lat: 8.8, lng: 7.3 }; // roughly center Nigeria
    const destinationLocation = userLocation || { lat: 9.076, lng: 7.398 }; // Abuja

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#141414] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div>
                    <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-500" /> Live Geolocation Tracker
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Track your order's proximity to your real-world location.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => setIsTrackModalOpen(true)}
                        className="flex-1 md:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-sm font-bold text-black transition-colors flex items-center justify-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Track by ID
                    </button>
                    <button 
                        onClick={handleLocateMe}
                        disabled={findingLocation}
                        className="flex-1 md:flex-none px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-amber-500 rounded-xl text-sm font-bold text-zinc-800 dark:text-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Crosshair className={`w-4 h-4 ${findingLocation ? 'animate-spin text-amber-500' : 'text-zinc-600 dark:text-zinc-400'}`} />
                        {findingLocation ? 'Locating...' : 'Use My Location'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden p-1">
                {/* Map Area */}
                <div className="relative h-80 bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden inset-ring-1 inset-ring-zinc-800">
                    {!hasValidKey ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-center p-6">
                            <Key className="w-8 h-8 text-amber-500 mb-4" />
                            <h2 className="text-lg font-bold text-black dark:text-white mb-2">Google Maps API Key Required</h2>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-sm">
                                To view the live tracking map, please add your Google Maps Platform API key in the AI Studio Secrets panel.
                            </p>
                            <ul className="text-left text-xs text-zinc-500 space-y-1 bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-sm">
                                <li>1. Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
                                <li>2. Select <strong>Secrets</strong></li>
                                <li>3. Type <code>GOOGLE_MAPS_PLATFORM_KEY</code> and paste key</li>
                            </ul>
                        </div>
                    ) : (
                        <APIProvider apiKey={API_KEY} version="weekly">
                            <GMap
                                defaultCenter={defaultCourierLocation}
                                defaultZoom={6}
                                mapId="LIVE_TRACKING_MAP"
                                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <RouteDisplay origin={defaultCourierLocation} destination={destinationLocation} />
                                
                                {/* Courier Marker */}
                                <AdvancedMarker position={defaultCourierLocation} title="Courier Location">
                                    <Pin background="#f59e0b" borderColor="#b45309" glyphColor="#000">
                                        <Truck className="w-4 h-4" />
                                    </Pin>
                                </AdvancedMarker>
                                
                                {/* Destination / User Location Marker */}
                                <AdvancedMarker position={destinationLocation} title="Destination">
                                    <Pin background="#10b981" borderColor="#047857" glyphColor="#fff">
                                        <Crosshair className="w-4 h-4" />
                                    </Pin>
                                </AdvancedMarker>
                            </GMap>
                        </APIProvider>
                    )}
                </div>

                {/* Status Timeline */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Order #PH-99214</h2>
                            <p className="text-sm text-zinc-500">Live Backend Status: {liveData.status}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black text-amber-500">{userLocation ? 'Approaching' : 'In Transit'}</div>
                            <p className="text-sm text-zinc-500">
                                {liveData.etaMins ? `Real-time ETA: ${liveData.etaMins} mins` : (userLocation ? 'Estimated delivery: Within 30 mins' : 'Estimated delivery: Today, 4:00 PM')}
                            </p>
                        </div>
                    </div>

                    <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 space-y-8 pb-4">
                        <div className="relative pl-8">
                            <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-2 top-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Order Confirmed</h4>
                            <p className="text-sm text-zinc-500">Payment successful via Paystack</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-2 top-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Dispatched from Lagos Hub</h4>
                            <p className="text-sm text-zinc-500">Handed over to courier</p>
                        </div>
                        <div className="relative pl-8">
                            <div className={`absolute w-4 h-4 rounded-full -left-2 top-1 flex items-center justify-center ${userLocation ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}>
                                {!userLocation && <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />}
                            </div>
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">In Transit to Destination</h4>
                            <p className="text-sm text-zinc-500">Currently passing Lokoja</p>
                        </div>
                        <div className={`relative pl-8 ${userLocation ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`absolute w-4 h-4 rounded-full items-center justify-center -left-2 top-1 ${userLocation ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] flex' : 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700'}`}>
                                {userLocation && <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />}
                            </div>
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Out for Delivery</h4>
                            <p className="text-sm text-zinc-500">{userLocation ? 'Courier is approaching your location' : 'Courier will call before arrival'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <TrackOrderModal 
                isOpen={isTrackModalOpen} 
                onClose={() => setIsTrackModalOpen(false)} 
            />
        </div>
    );
};
