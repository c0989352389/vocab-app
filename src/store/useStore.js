import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyAnswer, todayStr } from '../utils/srs'

export const useStore = create(
  persist(
    (set, get) => ({
      // ---- 進度 (key = wordId) ----
      progress: {},

      // ---- 每日歷史 (YYYY-MM-DD -> count) ----
      dailyHistory: {},

      // ---- 使用者狀態 ----
      dailyGoal: 20,
      streak: 0,
      gems: 0,
      lastStudyDate: null,
      todayLearned: 0,
      todayDate: todayStr(),

      // ---- actions ----
      // 回傳事件 { gemsDelta, goalReached, streakMilestone, comboBonus }
      answer(wordId, correct, comboCount = 0) {
        const st = get()
        const prev = st.progress[wordId]
        const next = applyAnswer(prev, correct)

        // 跨日重置
        const today = todayStr()
        let todayLearned = st.todayLearned
        let todayDate = st.todayDate
        if (todayDate !== today) {
          todayLearned = 0
          todayDate = today
        }

        // 寶石: 答對 +10 / 答錯 +2; 連對 5 +5, 連對 10 +15
        let gemsDelta = correct ? 10 : 2
        let comboBonus = 0
        if (correct && comboCount > 0 && comboCount % 10 === 0) comboBonus = 15
        else if (correct && comboCount > 0 && comboCount % 5 === 0) comboBonus = 5
        gemsDelta += comboBonus
        const gems = st.gems + gemsDelta

        // 連勝
        let streak = st.streak
        let lastStudyDate = st.lastStudyDate
        let streakMilestone = 0
        if (lastStudyDate !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yStr = todayStr(yesterday)
          if (lastStudyDate === yStr) streak += 1
          else streak = 1
          lastStudyDate = today
          if ([3, 7, 14, 30, 60, 100].includes(streak)) streakMilestone = streak
        }

        const newTodayLearned = todayLearned + 1
        const goalReached =
          newTodayLearned === st.dailyGoal && st.todayLearned < st.dailyGoal

        const dailyHistory = {
          ...st.dailyHistory,
          [today]: (st.dailyHistory[today] || 0) + 1,
        }

        set({
          progress: { ...st.progress, [wordId]: next },
          gems,
          todayLearned: newTodayLearned,
          todayDate,
          streak,
          lastStudyDate,
          dailyHistory,
        })

        return { gemsDelta, comboBonus, goalReached, streakMilestone }
      },

      setDailyGoal(n) {
        set({ dailyGoal: n })
      },

      resetAll() {
        set({
          progress: {},
          streak: 0,
          gems: 0,
          lastStudyDate: null,
          todayLearned: 0,
          todayDate: todayStr(),
          dailyHistory: {},
        })
      },

      importData(data) {
        if (!data || typeof data !== 'object') return false
        set({
          progress: data.progress || {},
          dailyHistory: data.dailyHistory || {},
          streak: data.streak || 0,
          gems: data.gems || 0,
          dailyGoal: data.dailyGoal || 20,
          lastStudyDate: data.lastStudyDate || null,
          todayLearned: data.todayLearned || 0,
          todayDate: data.todayDate || todayStr(),
        })
        return true
      },

      // 跨日時清空 todayLearned
      checkDateRollover() {
        const today = todayStr()
        if (get().todayDate !== today) {
          set({ todayDate: today, todayLearned: 0 })
        }
      },
    }),
    {
      name: 'vocab-app-store',
      version: 1,
    }
  )
)
