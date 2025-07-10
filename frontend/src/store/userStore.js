import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseApp } from '../config/firebase';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,
      
      // 检查认证状态
      checkAuth: () => {
        set({ loading: true });
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              // 获取用户详细信息
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              
              if (userDoc.exists()) {
                set({ 
                  user: {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || userDoc.data().displayName || '用户',
                    photoURL: firebaseUser.photoURL,
                    ...userDoc.data()
                  },
                  loading: false,
                  error: null
                });
              } else {
                // 如果用户文档不存在，创建一个
                const newUser = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || '用户',
                  photoURL: firebaseUser.photoURL,
                  createdAt: new Date(),
                  settings: {
                    defaultCurrency: 'CNY',
                    notificationDays: 7,
                    theme: 'system'
                  },
                  notificationChannels: {}
                };
                
                await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                set({ user: newUser, loading: false, error: null });
              }
            } catch (error) {
              console.error('获取用户数据失败:', error);
              set({ 
                user: {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || '用户',
                  photoURL: firebaseUser.photoURL
                },
                loading: false,
                error: null
              });
            }
          } else {
            set({ user: null, loading: false, error: null });
          }
        });
        
        // 返回取消订阅函数，以便在组件卸载时调用
        return unsubscribe;
      },
      
      // 登录
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          await signInWithEmailAndPassword(auth, email, password);
          // checkAuth会处理用户数据的加载
        } catch (error) {
          console.error('登录失败:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // 演示账户登录
      loginWithDemo: async () => {
        try {
          set({ loading: true, error: null });
          
          // 检测部署平台
          const hostname = window.location.hostname;
          let demoEmail = 'demo@subscribe.com';
          let demoPassword = 'demo123456';
          
          // 根据不同部署平台使用不同的演示账户
          if (hostname.includes('vercel.app')) {
            demoEmail = 'vercel-demo@subscribe.com';
          } else if (hostname.includes('pages.dev')) {
            demoEmail = 'cloudflare-demo@subscribe.com';
          }
          
          await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
          // checkAuth会处理用户数据的加载
        } catch (error) {
          console.error('演示登录失败:', error);
          
          // 如果演示账户登录失败，使用模拟数据
          const demoUser = {
            uid: 'demo-user-id',
            email: 'demo@subscribe.com',
            displayName: '演示用户',
            photoURL: null,
            isDemo: true,
            settings: {
              defaultCurrency: 'CNY',
              notificationDays: 7,
              theme: 'system'
            },
            notificationChannels: {
              telegram: { enabled: true, chatId: '123456789' },
              wxpusher: { enabled: true, uid: 'demo-wxpusher-uid' }
            }
          };
          
          set({ user: demoUser, loading: false, error: null });
        }
      },
      
      // 登出
      logout: async () => {
        try {
          set({ loading: true, error: null });
          
          // 如果是演示用户，直接清除状态
          const { user } = get();
          if (user?.isDemo) {
            set({ user: null, loading: false, error: null });
            return;
          }
          
          await signOut(auth);
          set({ user: null, loading: false, error: null });
        } catch (error) {
          console.error('登出失败:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // 更新用户信息
      updateUser: async (userData) => {
        try {
          set({ loading: true, error: null });
          
          const { user } = get();
          
          // 如果是演示用户，只更新本地状态
          if (user?.isDemo) {
            set({ 
              user: { ...user, ...userData },
              loading: false,
              error: null
            });
            return;
          }
          
          await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
          
          set({ 
            user: { ...user, ...userData },
            loading: false,
            error: null
          });
        } catch (error) {
          console.error('更新用户信息失败:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // 更新用户设置
      updateSettings: async (settings) => {
        const { user, updateUser } = get();
        if (!user) return;
        
        await updateUser({ settings: { ...user.settings, ...settings } });
      },
      
      // 更新通知渠道
      updateNotificationChannel: async (channel, config) => {
        const { user, updateUser } = get();
        if (!user) return;
        
        const updatedChannels = { 
          ...user.notificationChannels,
          [channel]: { ...user.notificationChannels?.[channel], ...config }
        };
        
        await updateUser({ notificationChannels: updatedChannels });
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user
      })
    }
  )
);

export { useUserStore };
export default useUserStore; 