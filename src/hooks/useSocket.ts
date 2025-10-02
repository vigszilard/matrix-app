'use client';

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { InterviewData } from '../types';

type SocketType = ReturnType<typeof io>;

export const useSocket = (interviewId: string, initialData?: InterviewData) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const initialDataRef = useRef(initialData);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      if (initialDataRef.current) {
        newSocket.emit('join-interview', initialDataRef.current);
      } else {
        newSocket.emit('join-interview', { id: interviewId });
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [interviewId]);

  return { socket, isConnected };
};

export const useInterviewSync = (interviewId: string, initialData: InterviewData) => {
  const { socket, isConnected } = useSocket(interviewId, initialData);
  const [interviewData, setInterviewData] = useState<InterviewData>(initialData);
  const [sessionTerminated, setSessionTerminated] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleInterviewData = (data: InterviewData) => {
      setInterviewData(data);
    };

    const handleSessionTerminated = () => {
      setSessionTerminated(true);
    };

    socket.on('interview-data', handleInterviewData);
    socket.on('session-terminated', handleSessionTerminated);

    return () => {
      socket.off('interview-data', handleInterviewData);
      socket.off('session-terminated', handleSessionTerminated);
    };
  }, [socket]);

  const updateSpecialization = (specialization: 'manual' | 'automation' | null) => {
    if (socket) {
      socket.emit('update-specialization', { interviewId, specialization });
    }
  };

  const updateAutomationTools = (automationTools: ('selenium' | 'cypress' | 'playwright')[]) => {
    if (socket) {
      socket.emit('update-automation-tools', { interviewId, automationTools });
    }
  };

  const updateSkillScore = (
    skillId: string, 
    interviewer: 'interviewer1' | 'interviewer2', 
    score: number | null
  ) => {
    if (socket) {
      socket.emit('update-skill-score', { interviewId, skillId, interviewer, score });
    }
  };

  const updateComment = (
    categoryId: string, 
    interviewer: 'interviewer1' | 'interviewer2', 
    comment: string
  ) => {
    if (socket) {
      socket.emit('update-comment', { interviewId, categoryId, interviewer, comment });
    }
  };

  return {
    interviewData,
    isConnected,
    sessionTerminated,
    updateSpecialization,
    updateAutomationTools,
    updateSkillScore,
    updateComment
  };
};
