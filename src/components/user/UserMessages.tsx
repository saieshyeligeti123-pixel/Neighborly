import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Search, 
  MapPin, 
  Clock, 
  CheckCheck, 
  Building2, 
  Package, 
  ExternalLink,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-react';

export const UserMessages: React.FC = () => {
  const { 
    currentUser, 
    conversations, 
    messages, 
    activeConversationId, 
    setActiveConversationId, 
    sendChatMessage,
    items,
    setActiveItemModal 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations where currentUser is participant
  const userConversations = conversations.filter(c => 
    c.takerId === currentUser.id || c.lenderId === currentUser.id
  );

  // Set initial active conversation if none selected
  useEffect(() => {
    if (!activeConversationId && userConversations.length > 0) {
      setActiveConversationId(userConversations[0].id);
    }
  }, [userConversations, activeConversationId, setActiveConversationId]);

  const activeConv = userConversations.find(c => c.id === activeConversationId);

  // Filter messages for active conversation
  const convMessages = messages.filter(m => m.conversationId === activeConversationId);

  // Target item if linked
  const linkedItem = activeConv?.itemId ? items.find(i => i.id === activeConv.itemId) : null;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    sendChatMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const handleQuickSend = (text: string) => {
    if (!activeConversationId) return;
    sendChatMessage(activeConversationId, text);
  };

  const quickReplies = [
    'Is this item available for pickup today?',
    'Can we meet at Gate Desk 1 for the handover?',
    'What is the security deposit handover procedure?',
    'I have returned the item at the reception. Please inspect!',
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs">
        <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
          Resident-to-Resident Direct Communication
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
          Messages & Item Inquiries
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
          Chat directly with lenders and borrowers in Green Meadows to arrange pick-up times, test appliances, and coordinate Gate Desk handovers.
        </p>
      </div>

      {/* Main Chat Layout */}
      <div className="ios-glass rounded-3xl border border-white/50 dark:border-white/10 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[calc(100vh-320px)] max-h-[750px]">
        
        {/* Left Column: Conversation Roster (4 cols) */}
        <div className="md:col-span-4 border-r border-neutral-200/50 dark:border-white/10 flex flex-col bg-white/40 dark:bg-black/30">
          
          <div className="p-3.5 border-b border-neutral-200/50 dark:border-white/10">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchConv}
                onChange={(e) => setSearchConv(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-white/5">
            {userConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                <MessageSquare className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                <span>No conversations yet. Open any item in the Explore catalog to message the owner!</span>
              </div>
            ) : (
              userConversations
                .filter(c => {
                  const query = searchConv.toLowerCase();
                  return (c.itemTitle || '').toLowerCase().includes(query) ||
                         c.lenderName.toLowerCase().includes(query) ||
                         c.takerName.toLowerCase().includes(query);
                })
                .map(conv => {
                  const isCurrentLender = conv.lenderId === currentUser.id;
                  const partnerName = isCurrentLender ? conv.takerName : conv.lenderName;
                  const partnerFlat = isCurrentLender ? conv.takerFlat : conv.lenderFlat;
                  const isSelected = conv.id === activeConversationId;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversationId(conv.id)}
                      className={`w-full text-left p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${isSelected ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-emerald-600' : 'hover:bg-neutral-50 dark:hover:bg-white/5'}`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                        {partnerName.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-neutral-900 dark:text-white text-xs truncate">
                            {partnerName}
                          </span>
                          <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                            {conv.lastMessageTimestamp || ''}
                          </span>
                        </div>

                        <div className="text-[11px] text-neutral-500 truncate">
                          Flat {partnerFlat} · {isCurrentLender ? 'Borrower' : 'Lender'}
                        </div>

                        {conv.itemTitle && (
                          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate mt-0.5 flex items-center gap-1">
                            <Package className="w-3 h-3 shrink-0" />
                            <span>{conv.itemTitle}</span>
                          </div>
                        )}

                        <div className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                          {conv.lastMessage || 'No messages yet'}
                        </div>
                      </div>
                    </button>
                  );
                })
            )}
          </div>

        </div>

        {/* Right Column: Active Conversation Thread (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-white/20 dark:bg-black/20">
          
          {activeConv ? (
            <>
              {/* Thread Header with Item Preview */}
              <div className="p-3.5 px-5 border-b border-neutral-200/50 dark:border-white/10 flex items-center justify-between gap-4 bg-white/50 dark:bg-black/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                    {(activeConv.lenderId === currentUser.id ? activeConv.takerName : activeConv.lenderName).charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <span>{activeConv.lenderId === currentUser.id ? activeConv.takerName : activeConv.lenderName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-neutral-100 dark:bg-white/10 text-neutral-500 font-normal">
                        Flat {activeConv.lenderId === currentUser.id ? activeConv.takerFlat : activeConv.lenderFlat}
                      </span>
                    </div>
                    {activeConv.itemTitle && (
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                        <Package className="w-3 h-3" />
                        <span>Discussing: <strong>{activeConv.itemTitle}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {linkedItem && (
                  <button
                    onClick={() => setActiveItemModal(linkedItem)}
                    className="px-3 py-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-300/40 dark:border-emerald-800/40 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>View Item Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                {convMessages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-neutral-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-600" />
                    <span>No messages yet. Say hello to your neighbor and confirm availability!</span>
                  </div>
                ) : (
                  convMessages.map(msg => {
                    const isMine = msg.senderId === currentUser.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-neutral-400">
                          <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                            {isMine ? 'You' : msg.senderName}
                          </span>
                          <span>· Flat {msg.senderFlat}</span>
                          <span>·</span>
                          <span className="font-mono">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isMine
                              ? 'bg-emerald-700 text-white rounded-br-xs'
                              : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200/70 dark:border-white/10 rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              <div className="px-4 py-2 border-t border-neutral-200/40 dark:border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none bg-neutral-50/50 dark:bg-neutral-900/30">
                <span className="text-[10px] text-neutral-400 font-semibold shrink-0 uppercase tracking-wider">Quick:</span>
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSend(qr)}
                    className="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer shadow-2xs shrink-0"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-3.5 border-t border-neutral-200/50 dark:border-white/10 bg-white/70 dark:bg-black/50 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message to your neighbor..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-neutral-400">
              Select a conversation on the left to start messaging.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
