import { useState, useEffect } from 'react';

interface FamilyMember {
  id: string;
  user_id?: string;
  name: string;
  role: string;
  relationship?: string;
  avatar: string;
  avatar_type: string;
  photo_url?: string;
  points: number;
  level: number;
  workload: number;
  age?: number;
  created_at: string;
  updated_at: string;
  dreams?: any[];
  piggyBank?: number;
  achievements?: string[];
  responsibilities?: string[];
}

const STORAGE_KEY = 'family_members';

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMembers(JSON.parse(stored));
      } else {
        setMembers([]);
      }
    } catch (err) {
      setError('Ошибка загрузки данных');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const saveMembers = (newMembers: FamilyMember[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMembers));
    setMembers(newMembers);
  };

  const fetchMembers = async () => {
    loadMembers();
  };

  const addMember = async (memberData: Partial<FamilyMember>) => {
    try {
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        name: memberData.name || '',
        role: memberData.role || '',
        avatar: memberData.avatar || '👤',
        avatar_type: memberData.avatar_type || 'emoji',
        points: 0,
        level: 1,
        workload: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...memberData
      };
      
      const updated = [...members, newMember];
      saveMembers(updated);
      return { success: true, member: newMember };
    } catch (err) {
      return { success: false, error: 'Ошибка добавления члена семьи' };
    }
  };

  const updateMember = async (memberData: Partial<FamilyMember> & { id: string }) => {
    try {
      const updated = members.map(m => 
        m.id === memberData.id 
          ? { ...m, ...memberData, updated_at: new Date().toISOString() }
          : m
      );
      saveMembers(updated);
      const updatedMember = updated.find(m => m.id === memberData.id);
      return { success: true, member: updatedMember };
    } catch (err) {
      return { success: false, error: 'Ошибка обновления члена семьи' };
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      const updated = members.filter(m => m.id !== memberId);
      saveMembers(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Ошибка удаления члена семьи' };
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember
  };
}