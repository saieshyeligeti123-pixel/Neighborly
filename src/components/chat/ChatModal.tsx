import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Send, 
  MessageSquare, 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Sparkles, 
  Clock, 
  Package, 
  Check, 
  CheckCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { ChatConversation } from '../../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
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
  const [mobileShowList, setMobileShowList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations for the current logged-in resident
  const userConversations = conversations.filter(
    c => c.lenderId === currentUser.id || c.takerId === currentUser.id
  );

  // If no active conversation is selected yet, default to first available
  useEffect(() => {
    if (isOpen) {
      if (!activeConversationId && userConversations.length > 0) {
        setActiveConversationId(userConversations[0].id);
      }
    }
  }, [isOpen, activeConversationId, userConversations]);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  // Conversation messages
  const activeMessages = messages.filter(m => m.conversationId === activeConversationId);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversationId]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;
    sendChatMessage(activeConversationId, inputText);
    setInputText('');
  };

  const handleQuickPrompt = (promptText: string) => {
    if (!activeConversationId) return;
    sendChatMessage(activeConversationId, promptText);
  };

  const isLender = activeConv ? activeConv.lenderId === currentUser.id : false;
  const otherPartyName = activeConv ? (isLender ? activeConv.takerName : activeConv.lenderName) : '';
  const otherPartyFlat = activeConv ? (isLender ? activeConv.takerFlat : activeConv.lenderFlat) : '';
  const otherPartyRole = isLender ? 'Taker (Borrower)' : 'Lender (Owner)';
  const myRole = isLender ? 'Lender (Owner)' : 'Taker (Borrower)';

  // Find linked item
  const linkedItem = activeConv?.itemId ? items.find(i => i.id === activeConv.itemId) : null;

  // Quick suggestion chips based on role
  const quickSuggestions = isLender
    ? [
        "Item is packed and ready for pickup at my flat!",
        "Are you free to meet at Tower lobby?",
        "Please remember to keep the safety box safe.",
        "Check-in received! Releasing your deposit now."
      ]
    : [
        "Hi! When is a good time to pick this up?",
        "I'm downstairs at the Tower lobby right now!",
        "Is the battery/power cord included in the bag?",
        "Just handed it back at the Gate 1 desk."
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* Main Glass Dialog */}
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[760px] ios-glass bg-white/95 dark:bg-neutral-900/95 border border-neutral-200/60 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-neutral-200/50 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/50 dark:bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Neighborly Resident Chat
                </h2>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                  Direct Lender ↔ Taker
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Coordinating handover, return checks, and care instructions between verified neighbors
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close chat window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split Screen */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Pane: Conversations List */}
          <div className={`${mobileShowList ? 'flex' : 'hidden md:flex'} w-full md:w-80 border-r border-neutral-200/50 dark:border-white/10 flex-col bg-neutral-50/50 dark:bg-black/20 shrink-0`}>
            
            <div className="p-3 border-b border-neutral-200/40 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Conversations ({userConversations.length})
              </span>
              <span className="text-[10px] text-neutral-400">
                Green Meadows
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-white/5">
              {userConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  No active conversations yet. Request an item or browse the catalog to message a lender!
                </div>
              ) : (
                userConversations.map(conv => {
                  const isCurrentLender = conv.lenderId === currentUser.id;
                  const otherName = isCurrentLender ? conv.takerName : conv.lenderName;
                  const otherFlat = isCurrentLender ? conv.takerFlat : conv.lenderFlat;
                  const roleTag = isCurrentLender ? 'Taker' : 'Lender';
                  const isSelected = conv.id === activeConversationId;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveConversationId(conv.id);
                        setMobileShowList(false);
                      }}
                      className={`w-full text-left p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-l-4 border-emerald-600 dark:border-emerald-500' 
                          : 'hover:bg-neutral-100/60 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="relative shrink-0">
                        {conv.itemImage ? (
                          <img 
                            src={conv.itemImage} 
                            alt={conv.itemTitle || 'Item'} 
                            className="w-11 h-11 rounded-xl object-cover border border-neutral-200 dark:border-white/10"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                            {otherName.charAt(0)}
                          </div>
                        )}
                        <span className={`absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded-sm border ${
                          isCurrentLender 
                            ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300' 
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {roleTag}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                            {otherName}
                          </span>
                          <span className="text-[10px] text-neutral-400 whitespace-nowrap font-mono">
                            {conv.lastMessageTimestamp || ''}
                          </span>
                        </div>

                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate font-medium">
                          {conv.itemTitle || 'Resource Chat'}
                        </div>

                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                          {conv.lastMessage || 'No messages yet'}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Pane: Active Chat Room */}
          <div className={`${mobileShowList ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white dark:bg-neutral-900 overflow-hidden`}>
            
            {activeConv ? (
              <>
                {/* Active Chat Header */}
                <div className="px-4 py-3 border-b border-neutral-200/50 dark:border-white/10 flex items-center justify-between bg-neutral-50/60 dark:bg-black/30 shrink-0">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setMobileShowList(true)}
                      className="md:hidden p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {otherPartyName.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                          {otherPartyName}
                        </h3>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{otherPartyFlat}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        <span className={`font-semibold ${isLender ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          Neighbor: {otherPartyRole}
                        </span>
                        <span>·</span>
                        <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                          You: {myRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Item preview badge */}
                  {activeConv.itemTitle && (
                    <div 
                      onClick={() => {
                        if (linkedItem) setActiveItemModal(linkedItem);
                      }}
                      className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-white/10 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors max-w-[240px]"
                      title="Click to view item details"
                    >
                      {activeConv.itemImage && (
                        <img 
                          src={activeConv.itemImage} 
                          alt="" 
                          className="w-7 h-7 rounded-lg object-cover shrink-0" 
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-[10px] text-neutral-400 uppercase font-semibold">Resource</div>
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                          {activeConv.itemTitle}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Context Card */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-2 border-b border-emerald-100 dark:border-emerald-900/30 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Resident verified · Safe community handovers at Gate Desk or Resident Flats</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 hidden sm:inline">
                    Green Meadows Sharing Policy
                  </span>
                </div>

                {/* Messages Timeline */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {activeMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                      <MessageSquare className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-2" />
                      <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        No messages yet in this conversation
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1 max-w-xs">
                        Send a message below to coordinate handover timing, confirm item condition, or ask questions!
                      </div>
                    </div>
                  ) : (
                    activeMessages.map(msg => {
                      const isMe = msg.senderId === currentUser.id;

                      return (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-400">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                              {isMe ? 'You' : msg.senderName}
                            </span>
                            <span>({msg.senderFlat})</span>
                            <span className={`px-1 py-0.2 rounded text-[9px] font-semibold ${
                              msg.senderRole === 'lender' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {msg.senderRole === 'lender' ? 'Lender' : 'Taker'}
                            </span>
                          </div>

                          <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                            isMe 
                              ? 'bg-emerald-600 text-white rounded-tr-xs' 
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-xs border border-neutral-200/50 dark:border-white/5'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            
                            <div className={`text-[9px] font-mono mt-1 flex items-center justify-end gap-1 ${
                              isMe ? 'text-emerald-100' : 'text-neutral-400'
                            }`}>
                              <span>{msg.timestamp}</span>
                              {isMe && (
                                <CheckCheck className="w-3 h-3 text-emerald-200" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="px-4 py-2 bg-neutral-50/70 dark:bg-neutral-900/70 border-t border-neutral-200/40 dark:border-white/5 overflow-x-auto scrollbar-none flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-neutral-400 whitespace-nowrap flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Quick:</span>
                  </span>
                  {quickSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickPrompt(s)}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:border-emerald-500 hover:text-emerald-600 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Message Input Form */}
                <form 
                  onSubmit={handleSend}
                  className="p-3.5 border-t border-neutral-200/50 dark:border-white/10 bg-white dark:bg-neutral-900 flex items-center gap-2.5 shrink-0"
                >
                  <input 
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={`Message ${otherPartyName} (${myRole} ↔ ${otherPartyRole})...`}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm ios-glass bg-neutral-100/70 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      inputText.trim() 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-2" />
                <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Select a resident conversation
                </div>
                <div className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Choose a chat on the left to talk with the lender or taker regarding an item.
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
