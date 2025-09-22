import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function MessagesPage() {
  const messages = [
    { id: 1, sender: "Alice", content: "Hey, are you free tonight?", time: "10:20 AM" },
    { id: 2, sender: "You", content: "Yes, let’s meet at 7 PM.", time: "10:22 AM" },
    { id: 3, sender: "Alice", content: "Perfect, see you then!", time: "10:25 AM" },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <Card className="rounded-2xl shadow-md h-[70vh] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender !== "You" && (
                <Avatar className="mr-2">
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${msg.sender === "You" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                <p>{msg.content}</p>
                <span className="block text-[10px] mt-1 text-gray-500">{msg.time}</span>
              </div>
              {msg.sender === "You" && (
                <Avatar className="ml-2">
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </CardContent>

        {/* Input Box */}
        <div className="p-3 border-t flex items-center gap-2">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button className="rounded-full px-4 py-2" size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
