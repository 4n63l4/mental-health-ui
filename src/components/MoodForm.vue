<template>
  <div class="container">
    <h1>Mental Health Check-in 🌿</h1>

    <!-- Name Entry -->
    <div v-if="!nameSet" class="name-form card cozy-card">
      <input v-model="nameInput" placeholder="What's your name?" />
      <button @click="setName" :disabled="!nameInput">Start Check-in</button>
    </div>

    <!-- Mood Form -->
    <div v-else class="mood-form card cozy-card">
      <p>Hello, <strong>{{ name }}</strong>! 🌱 How are you feeling today?</p>
      <textarea v-model="mood" placeholder="Type your mood here..."></textarea>
      <button @click="submitMood" :disabled="loading">
        <!-- Spinner inside button -->
        <span v-if="loading" class="spinner"></span>
        {{ loading ? 'Submitting...' : 'Share Mood' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <!-- Mood History -->
    <h2>{{ nameSet ? name + "'s Mood Entries" : "Your Mood History" }}</h2>
    <ul class="mood-list">
      <li v-for="entry in filteredMoods" :key="entry.id" class="mood-card cozy-card">
        <div class="mood-user">🍃 {{ entry.full_name }}</div>
        <div class="mood-text">{{ entry.mood_text }}</div>
        <div v-if="entry.ai_message" class="ai-text">🌿 {{ entry.ai_message }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      nameInput: '',
      name: '',
      nameSet: false,
      mood: '',
      moods: [],
      loading: false,
      error: ''
    };
  },
  computed: {
    filteredMoods() {
      if (!this.nameSet) return [];
      return this.moods.filter(entry => entry.full_name === this.name);
    }
  },
  methods: {
    setName() {
      if (this.nameInput.trim()) {
        this.name = this.nameInput.trim();
        this.nameSet = true;
        this.fetchMoods();
      }
    },

    async submitMood() {
      if (!this.mood) {
        this.error = 'Please share how you feel.';
        return;
      }
      this.loading = true;
      this.error = '';
      try {
        await api.post('/moods', {
          full_name: this.name,
          mood_text: this.mood
        });
        this.mood = '';
        await this.fetchMoods();
      } catch (err) {
        console.error(err);
        this.error = 'Could not submit your mood.';
      } finally {
        this.loading = false;
      }
    },

    async fetchMoods() {
      try {
        const res = await api.get('/moods');
        this.moods = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } catch (err) {
        console.error(err);
        this.error = 'Could not load mood history.';
      }
    }
  }
};
</script>

<style scoped>
/* --- Container --- */
.container {
  max-width: 600px;
  margin: 30px auto;
  font-family: 'Poppins', sans-serif;
  background: #e8f5e9;
  padding: 20px;
border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}

/* --- Headings --- */
h1 {
  text-align: center;
  color: #2e7d32;
  font-size: 2rem;
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  color: #388e3c;
  margin-top: 30px;
  font-weight: 500;
}

/* --- Cards --- */
.cozy-card {
  background: #f1f8e9;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* --- Inputs & Textarea --- */
input, textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #c8e6c9;
  font-size: 16px;
  background: #ffffff;
  outline: none;
  transition: all 0.2s ease;
}

input:focus, textarea:focus {
  border-color: #66bb6a;
  box-shadow: 0 0 6px rgba(102,187,106,0.2);
}

/* --- Button --- */
button {
  position: relative;
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #66bb6a, #81c784);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

button:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.12);
}

/* --- Spinner --- */
.spinner {
  border: 3px solid #ffffff;
  border-top: 3px solid #2e7d32; /* green top for rotation effect */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- Mood History --- */
.mood-list {
  list-style: none;
  padding: 0;
}

.mood-card {
  padding: 16px;
  border-radius: 16px;
  background: #e8f5e9;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.2s ease;
}

.mood-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
}

/* --- Mood & AI Text --- */
.mood-user {
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 6px;
}

.mood-text {
  color: #33691e;
  margin-bottom: 8px;
}

.ai-text {
  font-style: italic;
  color: #558b2f;
}

/* --- Error --- */
.error {
  color: #d32f2f;
  margin-top: 8px;
}
</style>
