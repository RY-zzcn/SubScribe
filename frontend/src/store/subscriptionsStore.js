import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, API_ENDPOINTS } from '../config/api';

const useSubscriptionsStore = create(
  persist(
    (set, get) => ({
      subscriptions: [],
      isLoading: false,
      error: null,
      
      // 获取所有订阅
      fetchSubscriptions: async (userId) => {
        try {
          set({ isLoading: true, error: null });
          
          // 尝试从API获取订阅数据
          try {
            const token = localStorage.getItem('authToken');
            const data = await apiClient.get(`${API_ENDPOINTS.subscriptions.getAll}?userId=${userId}`, token);
            set({ subscriptions: data, isLoading: false });
            return;
          } catch (apiError) {
            console.warn('API请求失败，尝试使用Firebase:', apiError);
            // 如果API请求失败，尝试直接从Firebase获取数据
            // 这里保留Firebase兼容代码
          }
          
          // Firebase直接访问（兼容模式）
          const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
          const { firebaseApp } = await import('../config/firebase');
          
          const db = getFirestore(firebaseApp);
          const q = query(collection(db, 'subscriptions'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          
          const subscriptions = [];
          querySnapshot.forEach((doc) => {
            subscriptions.push({ id: doc.id, ...doc.data() });
          });
          
          set({ subscriptions, isLoading: false });
        } catch (error) {
          console.error('获取订阅失败:', error);
          set({ error: '获取订阅失败', isLoading: false });
        }
      },
      
      // 添加订阅
      addSubscription: async (subscription) => {
        try {
          set({ isLoading: true, error: null });
          
          // 尝试通过API添加
          try {
            const token = localStorage.getItem('authToken');
            const newSubscription = await apiClient.post(API_ENDPOINTS.subscriptions.create, subscription, token);
            set(state => ({
              subscriptions: [...state.subscriptions, newSubscription],
              isLoading: false
            }));
            return;
          } catch (apiError) {
            console.warn('API请求失败，尝试使用Firebase:', apiError);
          }
          
          // Firebase直接访问（兼容模式）
          const { getFirestore, collection, addDoc } = await import('firebase/firestore');
          const { firebaseApp } = await import('../config/firebase');
          
          const db = getFirestore(firebaseApp);
          const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
          
          const newSubscription = { id: docRef.id, ...subscription };
          set(state => ({
            subscriptions: [...state.subscriptions, newSubscription],
            isLoading: false
          }));
        } catch (error) {
          console.error('添加订阅失败:', error);
          set({ error: '添加订阅失败', isLoading: false });
        }
      },
      
      // 更新订阅
      updateSubscription: async (id, updatedData) => {
        try {
          set({ isLoading: true, error: null });
          
          // 尝试通过API更新
          try {
            const token = localStorage.getItem('authToken');
            const updatedSubscription = await apiClient.put(
              API_ENDPOINTS.subscriptions.update(id), 
              updatedData, 
              token
            );
            
            set(state => ({
              subscriptions: state.subscriptions.map(sub => 
                sub.id === id ? { ...sub, ...updatedSubscription } : sub
              ),
              isLoading: false
            }));
            return;
          } catch (apiError) {
            console.warn('API请求失败，尝试使用Firebase:', apiError);
          }
          
          // Firebase直接访问（兼容模式）
          const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
          const { firebaseApp } = await import('../config/firebase');
          
          const db = getFirestore(firebaseApp);
          await updateDoc(doc(db, 'subscriptions', id), updatedData);
          
          set(state => ({
            subscriptions: state.subscriptions.map(sub => 
              sub.id === id ? { ...sub, ...updatedData } : sub
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error('更新订阅失败:', error);
          set({ error: '更新订阅失败', isLoading: false });
        }
      },
      
      // 删除订阅
      deleteSubscription: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          // 尝试通过API删除
          try {
            const token = localStorage.getItem('authToken');
            await apiClient.delete(API_ENDPOINTS.subscriptions.delete(id), token);
            
            set(state => ({
              subscriptions: state.subscriptions.filter(sub => sub.id !== id),
              isLoading: false
            }));
            return;
          } catch (apiError) {
            console.warn('API请求失败，尝试使用Firebase:', apiError);
          }
          
          // Firebase直接访问（兼容模式）
          const { getFirestore, doc, deleteDoc } = await import('firebase/firestore');
          const { firebaseApp } = await import('../config/firebase');
          
          const db = getFirestore(firebaseApp);
          await deleteDoc(doc(db, 'subscriptions', id));
          
          set(state => ({
            subscriptions: state.subscriptions.filter(sub => sub.id !== id),
            isLoading: false
          }));
        } catch (error) {
          console.error('删除订阅失败:', error);
          set({ error: '删除订阅失败', isLoading: false });
        }
      },
      
      // 重置状态
      resetState: () => {
        set({
          subscriptions: [],
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'subscriptions-storage',
      partialize: (state) => ({
        subscriptions: state.subscriptions
      })
    }
  )
);

export default useSubscriptionsStore; 