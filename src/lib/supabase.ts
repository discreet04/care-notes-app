import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Tables Schema (SQL)
/*
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  age INTEGER,
  phone TEXT,
  address TEXT,
  role TEXT CHECK (role IN ('patient', 'caretaker')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Medications table
CREATE TABLE medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time TIME,
  instructions TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Health records table
CREATE TABLE health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'blood_pressure', 'temperature', 'heart_rate', etc.
  value TEXT NOT NULL,
  unit TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT, -- 'medication', 'exercise', 'checkup', etc.
  scheduled_time TIME,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own medications" ON medications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medications" ON medications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medications" ON medications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own health records" ON health_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health records" ON health_records FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
*/

// Authentication hooks and functions
export interface User {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  phone?: string;
  address?: string;
  role?: 'patient' | 'caretaker';
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  time?: string;
  instructions?: string;
  active: boolean;
  created_at: string;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  type: string;
  value: string;
  unit?: string;
  recorded_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type?: string;
  scheduled_time?: string;
  completed: boolean;
  created_at: string;
}

// Auth functions
export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            ...userData,
          },
        ]);

      if (profileError) throw profileError;
    }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return error ? null : profile;
};

// Medication functions
export const getMedications = async (userId: string): Promise<Medication[]> => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: false });

  return error ? [] : data;
};

export const addMedication = async (medication: Omit<Medication, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('medications')
    .insert([medication])
    .select()
    .single();

  return { data, error };
};

export const updateMedication = async (id: string, updates: Partial<Medication>) => {
  const { data, error } = await supabase
    .from('medications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const deleteMedication = async (id: string) => {
  const { error } = await supabase
    .from('medications')
    .update({ active: false })
    .eq('id', id);

  return { error };
};

// Health records functions
export const getHealthRecords = async (userId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(50);

  return error ? [] : data;
};

export const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'recorded_at'>) => {
  const { data, error } = await supabase
    .from('health_records')
    .insert([record])
    .select()
    .single();

  return { data, error };
};

// Tasks functions
export const getTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return error ? [] : data;
};

export const addTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  return { data, error };
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

// Chat functions
export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(100);

  return error ? [] : data;
};

export const saveChatMessage = async (message: Omit<ChatMessage, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([message])
    .select()
    .single();

  return { data, error };
};

// AI Chatbot function - Mock implementation
export const getAIResponse = async (message: string, userContext?: any): Promise<string> => {
  // This is a mock implementation. In production, you would integrate with OpenAI, Claude, or another AI service
  const responses = {
    medication: [
      "Remember to take your medications with food if instructed. This helps reduce stomach upset.",
      "It's important to take medications at the same time each day for best results.",
      "Never stop taking prescribed medications without consulting your doctor first."
    ],
    health: [
      "Regular monitoring of blood pressure is crucial for managing hypertension.",
      "Light exercise like walking can greatly improve your overall health.",
      "Stay hydrated and maintain a balanced diet for better health outcomes."
    ],
    general: [
      "I'm here to help you with your health questions. What would you like to know?",
      "Feel free to ask me about medications, symptoms, or general health advice.",
      "Remember, I can provide information but always consult your doctor for medical decisions."
    ]
  };

  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('pill')) {
    const medResponses = responses.medication;
    return medResponses[Math.floor(Math.random() * medResponses.length)];
  } else if (lowerMessage.includes('blood pressure') || lowerMessage.includes('health') || lowerMessage.includes('symptom')) {
    const healthResponses = responses.health;
    return healthResponses[Math.floor(Math.random() * healthResponses.length)];
  } else {
    const generalResponses = responses.general;
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }
};

// React Hook for authentication
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    getCurrentUser().then((userData) => {
      setUser(userData);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};