import React, { useState } from 'react';
import { 
  Send, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  Check, 
  Layers,
  ShieldCheck,
  Code
} from 'lucide-react';
import { ApiEndpointSpec, ProductItem, OrderRecord, UserAccount } from '../../types/qa';

interface ApiWorkbenchProps {
  products: ProductItem[];
  orders: OrderRecord[];
  currentUser: UserAccount | null;
}

export const ApiWorkbench: React.FC<ApiWorkbenchProps> = ({
  products,
  orders,
  currentUser
}) => {
  const endpoints: ApiEndpointSpec[] = [
    {
      id: "EP-01",
      method: "GET",
      endpoint: "/api/v1/products",
      description: "Retrieve active product catalog with schema verification",
      headers: { "Accept": "application/json" },
      expectedStatus: 200,
      sampleResponse: JSON.stringify(products, null, 2),
      requiresAuth: false
    },
    {
      id: "EP-02",
      method: "GET",
      endpoint: "/api/v1/products/99999",
      description: "Negative test: Request non-existent product ID to verify 404 handler",
      headers: { "Accept": "application/json" },
      expectedStatus: 404,
      sampleResponse: JSON.stringify({
        error: "Product not found",
        code: "ERR_PRODUCT_NOT_FOUND",
        timestamp: new Date().toISOString()
      }, null, 2),
      requiresAuth: false
    },
    {
      id: "EP-03",
      method: "POST",
      endpoint: "/api/v1/auth/login",
      description: "Authenticate user and issue JWT Bearer token",
      headers: { "Content-Type": "application/json" },
      requestPayload: JSON.stringify({
        email: "sarah.qa@strivelogic.com",
        password: "Password123!"
      }, null, 2),
      expectedStatus: 200,
      sampleResponse: JSON.stringify({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDEiLCJlbWFpbCI6InNhcmFoLnFhQHN0cml2ZWxvZ2ljLmNvbSIsImlhdCI6MTc2MDU5ODAwMH0.sample_signature_token",
        user: {
          id: 101,
          email: "sarah.qa@strivelogic.com",
          fullName: "Sarah Jenkins",
          role: "qa_tester"
        }
      }, null, 2),
      requiresAuth: false
    },
    {
      id: "EP-04",
      method: "POST",
      endpoint: "/api/v1/cart/items",
      description: "Negative test: Add item to cart with missing productId payload",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer sample_qa_token"
      },
      requestPayload: JSON.stringify({
        quantity: 2
      }, null, 2),
      expectedStatus: 422,
      sampleResponse: JSON.stringify({
        error: "Unprocessable Entity",
        details: [
          { field: "productId", message: "Field 'productId' is required and must be integer" }
        ]
      }, null, 2),
      requiresAuth: true
    },
    {
      id: "EP-05",
      method: "POST",
      endpoint: "/api/v1/orders",
      description: "Place validated e-commerce order and generate order confirmation",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sample_qa_token",
        "Idempotency-Key": "idemp_ord_test_8849"
      },
      requestPayload: JSON.stringify({
        items: [
          { productId: 1, quantity: 1 }
        ],
        shippingAddress: {
          fullName: "Sarah Jenkins",
          street: "742 Evergreen Terrace",
          city: "Springfield",
          state: "OR",
          zipCode: "97477"
        },
        paymentMethod: "Credit Card (ending 4242)"
      }, null, 2),
      expectedStatus: 201,
      sampleResponse: JSON.stringify({
        orderNumber: "QFG-2026-9025",
        status: "Processing",
        total: 215.99,
        createdAt: new Date().toISOString()
      }, null, 2),
      requiresAuth: true
    },
    {
      id: "EP-06",
      method: "GET",
      endpoint: "/api/v1/orders",
      description: "Negative test: Fetch protected orders without Authorization header",
      headers: {},
      expectedStatus: 401,
      sampleResponse: JSON.stringify({
        error: "Unauthorized",
        message: "Missing or invalid Authorization Bearer header"
      }, null, 2),
      requiresAuth: true
    }
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointSpec>(endpoints[0]);
  const [customPayload, setCustomPayload] = useState<string>(endpoints[0].requestPayload || '');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(200);
  const [responseBody, setResponseBody] = useState<string>(endpoints[0].sampleResponse);
  const [latencyMs, setLatencyMs] = useState<number>(48);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectEndpoint = (ep: ApiEndpointSpec) => {
    setSelectedEndpoint(ep);
    setCustomPayload(ep.requestPayload || '');
    setResponseStatus(ep.expectedStatus);
    setResponseBody(ep.sampleResponse);
    setLatencyMs(Math.floor(Math.random() * 40) + 30);
  };

  const handleSendRequest = async () => {
    setIsExecuting(true);
    // Simulate real network trip
    const simulatedLatency = Math.floor(Math.random() * 60) + 35;
    await new Promise(r => setTimeout(r, simulatedLatency + 100));

    setResponseStatus(selectedEndpoint.expectedStatus);
    setResponseBody(selectedEndpoint.sampleResponse);
    setLatencyMs(simulatedLatency);
    setIsExecuting(false);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(responseBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>REST API Testing Workbench &amp; Contract Validator</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute REST queries, validate HTTP status codes (200, 201, 401, 404, 422), assert schemas, and benchmark latency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Left: Endpoints Catalog */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700">
              API Endpoints ({endpoints.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[550px]">
            {endpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              const isPost = ep.method === 'POST';
              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`p-3 text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-100/90 border-l-2 border-slate-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isPost ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 truncate">
                      {ep.endpoint}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {ep.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-400">
                    <span>Expected: {ep.expectedStatus}</span>
                    {ep.requiresAuth && <span>· Requires Auth</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Request & Response Console */}
        <div className="lg:col-span-8 space-y-6">
          {/* Request Config Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  selectedEndpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-900">
                  {selectedEndpoint.endpoint}
                </span>
              </div>

              <button
                onClick={handleSendRequest}
                disabled={isExecuting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs self-start sm:self-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 my-3">
              {selectedEndpoint.description}
            </p>

            {/* Request Headers */}
            <div className="mb-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Headers
              </span>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                {Object.entries(selectedEndpoint.headers).length === 0 ? (
                  <span className="text-slate-400">No custom headers attached</span>
                ) : (
                  Object.entries(selectedEndpoint.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-slate-500 font-semibold">{k}:</span>
                      <span>{v}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Request Body (if POST) */}
            {selectedEndpoint.requestPayload && (
              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  JSON Request Payload
                </span>
                <textarea
                  rows={4}
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-md focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Response Console */}
          <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">
                  HTTP Response
                </span>
                {responseStatus && (
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    responseStatus < 300 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {responseStatus} {responseStatus === 200 ? 'OK' : responseStatus === 201 ? 'Created' : responseStatus === 401 ? 'Unauthorized' : responseStatus === 404 ? 'Not Found' : 'Unprocessable Entity'}
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{latencyMs}ms</span>
                </span>
              </div>

              <button
                onClick={handleCopyResponse}
                className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[350px]">
              {responseBody}
            </pre>

            {/* Contract Assertions Strip */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[11px] font-mono flex flex-wrap gap-4 text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Status == {selectedEndpoint.expectedStatus}
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Content-Type: application/json
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Latency &lt; 200ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
