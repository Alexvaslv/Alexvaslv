import { useState, ReactNode, useEffect } from "react";
import { Shield, Home, Sword, User, Users, Settings, HardHat, Shirt, Hand, Zap, Gem, Axe, Columns2, Footprints, Circle, ChevronRight, Coins, Diamond, Box, Mail, Globe, Hash, Crown, Lock, FlaskConical, Book, Trophy, Skull, Activity, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { signInWithPopup, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, onSnapshot, getDoc, updateDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";
import GraphicsSettings from "./components/GraphicsSettings";
import ClanSection from "./components/ClanSection";
import AdminPanel from "./components/AdminPanel";
import CityCenter from "./components/CityCenter";
import BattleSection from "./components/BattleSection";
import TutorialBattle from "./components/TutorialBattle";
import SaveHeroModal from "./components/SaveHeroModal";
import MailModal, { MailMessage } from "./components/MailModal";
import CommunitySection from "./components/CommunitySection";
import ItemModal from "./components/ItemModal";
import CitySection from "./components/CitySection";
import RankingSection from "./components/RankingSection";
import { Item } from "./types";
import { getLevelStats, formatNumber } from "./constants";

type NavTab = 'home' | 'battle' | 'hero' | 'clan' | 'community' | 'settings' | 'city' | 'ranking';

const HERO_TITLES = [
  "Новичок", "Путник", "Ученик", "Искатель", "Боец", "Молодой воин", "Охотник", "Следопыт", "Закалённый", "Опытный",
  "Воин", "Наёмник", "Убийца", "Разведчик", "Мастер клинка", "Ловец душ", "Хранитель пути", "Теневой боец", "Разрушитель", "Ветеран",
  "Кровавый воин", "Палач", "Повелитель боя", "Тень войны", "Заклинатель боли", "Охотник на героев", "Легенда арены", "Разрушитель кланов", "Несущий бурю", "Чемпион",
  "Великий чемпион", "Владыка битвы", "Повелитель тьмы", "Бог войны", "Несокрушимый", "Уничтожитель миров", "Повелитель душ", "Король арены", "Вечный воин", "Легенда",
  "Полубог", "Избранный", "Повелитель реальности", "Тот, кого боятся", "Абсолют", "Живое оружие", "Владыка бездны", "Бессмертный", "Последний герой", "Бог"
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTutorial, setIsTutorial] = useState(false);
  const [showSaveHeroModal, setShowSaveHeroModal] = useState(false);
  const [isAccountHidden, setIsAccountHidden] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [graphicsSettings, setGraphicsSettings] = useState({ bloom: true, ambientOcclusion: true, shadowQuality: 'medium' });
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [hp, setHp] = useState(100);
  const [mentor, setMentor] = useState<string | null>(null);
  const [clanName, setClanName] = useState("Новичок");
  const [username, setUsername] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    const savedTab = localStorage.getItem('activeTab');
    return (savedTab as NavTab) || 'hero';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  // City States
  const [bankAccount, setBankAccount] = useState({ isOpen: false, pin: '', balance: 0, loan: 0 });
  const [currentCity, setCurrentCity] = useState("Avalon");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [injuries, setInjuries] = useState(0);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [blessing, setBlessing] = useState<{ active: boolean, expiresAt: number | null }>({ active: false, expiresAt: null });
  
  // Settings State
  const [newUsernameInput, setNewUsernameInput] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [newPlayerIdInput, setNewPlayerIdInput] = useState("");
  
  // Backpack State
  const [backpackItems, setBackpackItems] = useState<Item[]>([]);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [activeBackpackTab, setActiveBackpackTab] = useState<'weapon' | 'armor' | 'elixir' | 'book'>('weapon');
  
  // Equipment State
  const [equippedItems, setEquippedItems] = useState<Record<string, Item | null>>({
    helmet: null,
    armor: null,
    bracers: null,
    weapon: null,
    belt: null,
    amulet: null,
    secondary: null,
    pants: null,
    boots: null,
    ring: null
  });
  const [selectedItem, setSelectedItem] = useState<{ item: Item, context: 'backpack' | 'equipped' } | null>(null);

  // Stats State
  const [freeStatPoints, setFreeStatPoints] = useState(0);
  const [assignedStats, setAssignedStats] = useState({ str: 0, agi: 0, int: 0, end: 0, intel: 0, wis: 0 });
  const baseStats = { 
    str: 5 + Math.floor(level * 1.2) + assignedStats.str, 
    agi: 5 + Math.floor(level * 1.2) + assignedStats.agi, 
    int: 5 + Math.floor(level * 1.2) + assignedStats.int, 
    end: 5 + Math.floor(level * 1.2) + assignedStats.end, 
    intel: (level >= 30 ? 5 + Math.floor(level * 1.2) : 0) + assignedStats.intel, 
    wis: (level >= 30 ? 5 + Math.floor(level * 1.2) : 0) + assignedStats.wis 
  };
  const [buffStats, setBuffStats] = useState({ str: 0, agi: 0, int: 0, end: 0, intel: 0, wis: 0 });
  
  const getItemStats = () => {
    const stats = { str: 0, agi: 0, int: 0, end: 0, intel: 0, wis: 0 };
    Object.values(equippedItems).forEach((item: Item | null) => {
      if (item && item.stats) {
        stats.str += (item.stats.attack || 0) + (item.stats.str || 0);
        stats.end += (item.stats.hp ? Math.floor(item.stats.hp / 10) : 0) + (item.stats.end || 0);
        stats.agi += (item.stats.defense || 0) + (item.stats.agi || 0);
        stats.int += item.stats.int || 0;
        stats.intel += item.stats.intel || 0;
        stats.wis += item.stats.wis || 0;
      }
    });
    return stats;
  };
  
  const itemStats = getItemStats();
  const blessingBonus = blessing.active && blessing.expiresAt && blessing.expiresAt > Date.now() ? 30 : 0;

  const autoDistributeStats = () => {
    if (freeStatPoints <= 0) return;
    
    setAssignedStats(prev => {
      const newStats = { ...prev };
      let points = freeStatPoints;
      const statKeys = level >= 30 ? ['str', 'agi', 'int', 'end', 'intel', 'wis'] as const : ['str', 'agi', 'int', 'end'] as const;
      
      while (points > 0) {
        let minStat: keyof typeof newStats = statKeys[0];
        let minValue = newStats[minStat];
        
        for (const key of statKeys) {
          if (newStats[key] < minValue) {
            minStat = key;
            minValue = newStats[key];
          }
        }
        
        newStats[minStat]++;
        points--;
      }
      return newStats;
    });
    setFreeStatPoints(0);
  };

  const totalStats = {
    str: baseStats.str + itemStats.str + buffStats.str + blessingBonus,
    agi: baseStats.agi + itemStats.agi + buffStats.agi + blessingBonus,
    int: baseStats.int + itemStats.int + buffStats.int + blessingBonus,
    end: baseStats.end + itemStats.end + buffStats.end + blessingBonus,
    intel: baseStats.intel + itemStats.intel + buffStats.intel + blessingBonus,
    wis: baseStats.wis + itemStats.wis + buffStats.wis + blessingBonus,
  };
  
  const maxHp = getLevelStats(level).hp + (itemStats.end * 10) + (buffStats.end * 10);
  
  const getRequiredXp = (lvl: number) => {
    if (lvl === 1) return 150;
    if (lvl === 2) return 300;
    if (lvl === 3) return 1000;
    if (lvl === 4) return 2000;
    if (lvl === 5) return 5000;
    if (lvl === 6) return 10000;
    let requiredXp = 10000;
    for (let i = 7; i <= lvl; i++) {
      requiredXp = Math.floor(requiredXp * 1.5);
    }
    return requiredXp;
  };
  
  const requiredXp = getRequiredXp(level);
  
  // Mail State
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [mailMessages, setMailMessages] = useState<MailMessage[]>([]);

  // Resources state
  const [resources, setResources] = useState<Record<string, number>>({
    silver: 50,
    gold: 10,
    diamonds: 5
  });

  // Player Stats
  const [playerStats, setPlayerStats] = useState({
    duel: { wins: 0, losses: 0 },
    battle2v2: { wins: 0, losses: 0 },
    squadBattle: { wins: 0, losses: 0 },
    battleRoyale: { wins: 0, losses: 0 },
    storyCompletion: 0
  });

  const [isSyncing, setIsSyncing] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Sync with Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userDocRef = doc(db, "users", user.uid);
        
        // Initial check if document exists
        try {
          console.log("Attempting getDoc...");
          const userDoc = await getDoc(userDocRef);
          console.log("getDoc successful. Exists:", userDoc.exists());
          if (!userDoc.exists()) {
            console.log("Document does not exist. Attempting setDoc...");
            // Create initial document if it doesn't exist
            const initialData = {
              uid: user.uid,
              email: user.email || "",
              username: user.displayName || "Герой",
              playerId: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
              level: 1,
              xp: 0,
              hp: 100,
              clanName: "Новичок",
              resources: { silver: 50, gold: 10, diamonds: 5 },
              backpackItems: [],
              equippedItems: {
                helmet: null, armor: null, bracers: null, weapon: null, belt: null,
                amulet: null, secondary: null, pants: null, boots: null, ring: null
              },
              bankAccount: { isOpen: false, pin: '', balance: 0, loan: 0 },
              currentCity: "Avalon",
              injuries: 0,
              blessing: { active: false, expiresAt: null },
              mailMessages: [],
              isAccountHidden: false,
              isAdmin: user.email === "alexeivasilev27081994@gmail.com" && Boolean(user.emailVerified),
              isTutorial: true,
              graphicsSettings: { bloom: true, ambientOcclusion: true, shadowQuality: 'medium' },
              updatedAt: Date.now()
            };
            console.log("initialData:", initialData);
            await setDoc(userDocRef, initialData);
            console.log("setDoc successful.");
          }
        } catch (error: any) {
          console.error("Initial Firestore check error:", error);
          if (error.code === 'resource-exhausted') {
            setQuotaExceeded(true);
          }
        }

        // Real-time listener
        const unsubSnapshot = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUsername(data.username);
            setPlayerId(data.playerId);
            setLevel(data.level);
            setXp(data.xp);
            setHp(data.hp);
            setClanName(data.clanName);
            setResources(data.resources);
            setBackpackItems(data.backpackItems);
            setEquippedItems(data.equippedItems);
            setBankAccount(data.bankAccount);
            setCurrentCity(data.currentCity);
            setInjuries(data.injuries);
            setBlessing(data.blessing);
            setMailMessages(data.mailMessages);
            setIsAccountHidden(data.isAccountHidden ?? false);
            setIsAdmin(data.isAdmin ?? false);
            setIsTutorial(data.isTutorial ?? false);
            setGraphicsSettings(data.graphicsSettings ?? { bloom: true, ambientOcclusion: true, shadowQuality: 'medium' });
            setFreeStatPoints(data.freeStatPoints ?? 0);
            setAssignedStats(data.assignedStats ?? { str: 0, agi: 0, int: 0, end: 0, intel: 0, wis: 0 });
            setPlayerStats(data.playerStats ?? {
              duel: { wins: 0, losses: 0 },
              battle2v2: { wins: 0, losses: 0 },
              squadBattle: { wins: 0, losses: 0 },
              battleRoyale: { wins: 0, losses: 0 },
              storyCompletion: 0
            });
            setIsSyncing(false);
          }
        }, (error: any) => {
          console.error("Firestore sync error:", error);
          if (error.code === 'resource-exhausted') {
            setQuotaExceeded(true);
          }
        });

        return () => unsubSnapshot();
      } else {
        setIsLoggedIn(false);
        setIsSyncing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save progress to Firestore
  useEffect(() => {
    if (!auth.currentUser || isSyncing || quotaExceeded) return;

    const saveTimeout = setTimeout(async () => {
      const userDocRef = doc(db, "users", auth.currentUser!.uid);
      try {
        await updateDoc(userDocRef, {
          username,
          playerId,
          level,
          xp,
          hp,
          clanName,
          resources,
          backpackItems,
          equippedItems,
          bankAccount,
          currentCity,
          injuries,
          blessing,
          mailMessages,
          isAccountHidden,
          isAdmin,
          isTutorial,
          graphicsSettings,
          freeStatPoints,
          assignedStats,
          playerStats,
          updatedAt: Date.now()
        });
      } catch (error: any) {
        console.error("Error saving progress:", error);
        if (error.code === 'resource-exhausted') {
          setQuotaExceeded(true);
        }
      }
    }, 1000); // Debounce saves

    return () => clearTimeout(saveTimeout);
  }, [username, playerId, level, xp, hp, clanName, resources, backpackItems, equippedItems, bankAccount, currentCity, injuries, blessing, mailMessages, isAccountHidden, isAdmin, isTutorial, graphicsSettings, freeStatPoints, assignedStats, playerStats, isSyncing, quotaExceeded]);

  const addResources = (type: string, amount: number) => {
    setResources(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + amount
    }));
  };

  const setPlayerLevel = (newLevel: number) => {
    const clampedLevel = Math.min(50, Math.max(1, newLevel));
    if (clampedLevel > level && clampedLevel <= 30) {
      setFreeStatPoints(prev => prev + (clampedLevel - level) * 5);
    }
    setLevel(clampedLevel);
    const newStats = getLevelStats(clampedLevel);
    const newMaxHp = newStats.hp + (itemStats.end * 10) + (buffStats.end * 10);
    setHp(newMaxHp);
  };

  const startNewJourney = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User signed in:", user.email);
      
      setLevel(1);
      setClanName("Новичок");
      setUsername(user.displayName || "Герой");
      setResources({
        silver: 0,
        gold: 0,
        diamonds: 0
      });
      setIsTutorial(true);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleTutorialVictory = () => {
    setIsTutorial(false);
    setShowSaveHeroModal(true);
  };

  const handleSaveHero = async (newUsername: string, email: string, password: string, gender: 'male' | 'female', side: 'light' | 'dark', race: 'human' | 'elf' | 'mage' | 'druid') => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      setUsername(newUsername);
      setNewUsernameInput(newUsername);
      
      // Generate unique 10-digit ID
      const newId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setPlayerId(newId);
      
      // Store new attributes
      console.log(`Character created: ${newUsername}, ${gender}, ${side}, ${race}`);
      
      // Send welcome mail with gifts
      setMailMessages([
        {
          id: Date.now().toString(),
          title: "Добро пожаловать!",
          content: `Приветствуем тебя, ${newUsername}! Ты успешно прошел обучение и сохранил своего героя. В качестве награды прими эти скромные дары. Удачи в твоих приключениях!`,
          read: false,
          hasGift: true,
          giftClaimed: false
        }
      ]);
      
      setShowSaveHeroModal(false);
      setIsLoggedIn(true);
      setActiveTab('hero');
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          alert("Вы вошли в существующий аккаунт.");
          setShowSaveHeroModal(false);
          setIsLoggedIn(true);
          setActiveTab('hero');
        } catch (signInError) {
          console.error("Error signing in:", signInError);
          alert("Этот email уже зарегистрирован, и пароль неверный.");
        }
      } else {
        alert("Ошибка при создании аккаунта. Убедитесь, что email валиден и пароль достаточно сильный.");
      }
    }
  };

  const handleReadMail = (id: string) => {
    setMailMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: true } : msg));
  };

  const handleClaimGift = (id: string) => {
    setMailMessages(prev => prev.map(msg => {
      if (msg.id === id && !msg.giftClaimed) {
        // Give gifts
        addResources('silver', 500);
        addResources('gold', 50);
        addResources('diamonds', 100);
        return { ...msg, giftClaimed: true };
      }
      return msg;
    }));
  };

  const addXp = (amount: number) => {
    let newXp = xp + amount;
    let newLevel = level;
    let reqXp = getRequiredXp(newLevel);
    
    // Проверка на повышение уровня
    let leveledUp = false;
    while (newXp >= reqXp && newLevel < 50) {
      newXp -= reqXp;
      newLevel++;
      reqXp = getRequiredXp(newLevel);
      leveledUp = true;
    }
    
    setXp(newXp);
    setLevel(newLevel);
    if (leveledUp) {
      if (newLevel <= 30) {
        setFreeStatPoints(prev => prev + 5);
      }
      const newStats = getLevelStats(newLevel);
      const newMaxHp = newStats.hp + (itemStats.end * 10) + (buffStats.end * 10);
      setHp(newMaxHp);
      setIsLevelUp(true);
      setTimeout(() => setIsLevelUp(false), 1000);
    }
  };

  const handleBattleVictory = (rewards: { xp: number, silver: number, gold: number, diamonds: number, items: Item[] }) => {
    addXp(rewards.xp);
    addResources('silver', rewards.silver);
    addResources('gold', rewards.gold);
    addResources('diamonds', rewards.diamonds);
    if (rewards.items.length > 0) {
      setBackpackItems(prev => [...prev, ...rewards.items]);
    }
  };

  const handleChangeUsername = () => {
    const name = newUsernameInput.trim();
    if (name === username) return;
    
    if (name.length < 4 || name.length > 12) {
      setUsernameError("Ник должен быть от 4 до 12 символов");
      return;
    }
    if (!/^[a-zA-Z]+$/.test(name)) {
      setUsernameError("Только английские буквы, без пробелов и цифр");
      return;
    }
    const TAKEN_NAMES = ['admin', 'moderator', 'support', 'goro'];
    if (TAKEN_NAMES.includes(name.toLowerCase())) {
      setUsernameError("Этот ник уже занят");
      return;
    }

    setUsernameError(null);
    setUsername(name);
    // In a real app, this would deduct resources or check availability
  };

  const handleChangePlayerId = () => {
    if (!newPlayerIdInput.trim() || newPlayerIdInput === playerId) return;
    setPlayerId(newPlayerIdInput);
    setNewPlayerIdInput("");
  };

  const handleResetAllHeroes = async () => {
    if (!isAdmin) return;
    if (window.confirm("Вы уверены, что хотите обнулить ВСЕХ героев, кланы и рейтинги? Это действие необратимо!")) {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const deleteUsersPromises = usersSnapshot.docs.map(docSnapshot => deleteDoc(doc(db, "users", docSnapshot.id)));
        
        // Assuming clans might be stored in 'clans' collection
        const clansSnapshot = await getDocs(collection(db, "clans"));
        const deleteClansPromises = clansSnapshot.docs.map(docSnapshot => deleteDoc(doc(db, "clans", docSnapshot.id)));

        await Promise.all([...deleteUsersPromises, ...deleteClansPromises]);
        
        alert("Все данные (герои, кланы, рейтинги) успешно обнулены.");
        window.location.reload();
      } catch (error) {
        console.error("Error resetting all data:", error);
        alert("Ошибка при обнулении данных.");
      }
    }
  };

  const handleRegenerateAllIds = async () => {
    if (!isAdmin) return;
    if (window.confirm("Вы уверены, что хотите обновить ID ВСЕМ игрокам? Это действие необратимо!")) {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const updatePromises = usersSnapshot.docs.map(docSnapshot => {
          const newId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
          return updateDoc(doc(db, "users", docSnapshot.id), { playerId: newId });
        });
        await Promise.all(updatePromises);
        alert("Все ID успешно обновлены.");
        window.location.reload();
      } catch (error) {
        console.error("Error regenerating IDs:", error);
        alert("Ошибка при обновлении ID.");
      }
    }
  };

  const handleEquip = (item: Item) => {
    setEquippedItems(prev => {
      const newEquipped = { ...prev };
      // Map item type to slot (simplified for now)
      let slot = '';
      if (item.type === 'weapon') slot = 'weapon';
      else if (item.type === 'armor') slot = 'armor'; // Could be helmet, pants, etc. based on sub-type, but let's stick to armor for now
      else return prev; // Elixirs and books aren't equipped in these slots
      
      if (slot) {
        // Return currently equipped item to backpack
        if (newEquipped[slot]) {
          setBackpackItems(bp => [...bp, newEquipped[slot]!]);
        }
        newEquipped[slot] = item;
        // Remove new item from backpack
        setBackpackItems(bp => bp.filter(i => i.id !== item.id));
      }
      return newEquipped;
    });
    setSelectedItem(null);
  };

  const handleUnequip = (item: Item) => {
    setEquippedItems(prev => {
      const newEquipped = { ...prev };
      let foundSlot = '';
      for (const key in newEquipped) {
        if (newEquipped[key]?.id === item.id) {
          foundSlot = key;
          break;
        }
      }
      if (foundSlot) {
        newEquipped[foundSlot] = null;
        setBackpackItems(bp => [...bp, item]);
      }
      return newEquipped;
    });
    setSelectedItem(null);
  };

  const handleDismantle = (item: Item) => {
    setBackpackItems(bp => bp.filter(i => i.id !== item.id));
    addResources('silver', 10);
    setSelectedItem(null);
    alert(`Вы разобрали ${item.name} и получили 10 серебра.`);
  };

  const handleDiscard = (item: Item) => {
    setBackpackItems(bp => bp.filter(i => i.id !== item.id));
    setSelectedItem(null);
  };

  const handleStore = (item: Item) => {
    setBackpackItems(bp => bp.filter(i => i.id !== item.id));
    setSelectedItem(null);
    alert(`${item.name} отправлен на личный склад.`);
  };

  const handleClanStore = (item: Item) => {
    setBackpackItems(bp => bp.filter(i => i.id !== item.id));
    setSelectedItem(null);
    alert(`${item.name} отправлен на склад клана.`);
  };

  const handleAutoEquip = () => {
    let bestWeapon = equippedItems.weapon;
    let bestArmor = equippedItems.armor;
    let newBackpack = [...backpackItems];

    // Find best weapon
    const weapons = newBackpack.filter(i => i.type === 'weapon');
    weapons.forEach(w => {
      if (!bestWeapon || (w.stats.attack || 0) > (bestWeapon.stats.attack || 0)) {
        if (bestWeapon) newBackpack.push(bestWeapon);
        bestWeapon = w;
        newBackpack = newBackpack.filter(i => i.id !== w.id);
      }
    });

    // Find best armor
    const armors = newBackpack.filter(i => i.type === 'armor');
    armors.forEach(a => {
      if (!bestArmor || (a.stats.defense || 0) > (bestArmor.stats.defense || 0)) {
        if (bestArmor) newBackpack.push(bestArmor);
        bestArmor = a;
        newBackpack = newBackpack.filter(i => i.id !== a.id);
      }
    });

    setEquippedItems({ weapon: bestWeapon, armor: bestArmor });
    setBackpackItems(newBackpack);
  };

  const getLevelStyle = (lvl: number) => {
    if (lvl <= 5) return "text-gray-400 border-gray-400/20 shadow-[0_0_15px_rgba(156,163,175,0.1)]";
    if (lvl <= 10) return "text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]";
    if (lvl <= 15) return "text-yellow-400 border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]";
    if (lvl <= 25) return "text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
    if (lvl <= 35) return "bg-gradient-to-r from-red-600 via-black to-red-600 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent border-red-900/40 shadow-[0_0_20px_rgba(220,38,38,0.2)]";
    if (lvl <= 45) return "bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent border-blue-200/30 shadow-[0_0_25px_rgba(191,219,254,0.3)]";
    return "bg-gradient-to-r from-yellow-300 via-white to-yellow-500 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent border-yellow-400/40 shadow-[0_0_30px_rgba(253,224,71,0.4)]";
  };

  const getAvatarBorderStyle = (lvl: number) => {
    if (lvl <= 25) return "border-white/10";
    if (lvl <= 35) return "border-red-900/40 shadow-[0_0_30px_rgba(220,38,38,0.2)]";
    if (lvl <= 45) return "border-blue-200/30 shadow-[0_0_40px_rgba(191,219,254,0.3)]";
    return "border-yellow-400/40 shadow-[0_0_50px_rgba(253,224,71,0.4)]";
  };

  const getClanNameStyle = (name: string) => {
    if (name === "Legion") return "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-transparent bg-clip-text animate-rainbow-glow tracking-widest";
    if (name === "Phoenix") return "text-white animate-fire-glow";
    if (name === "Titans") return "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-transparent bg-clip-text animate-rainbow-glow tracking-widest";
    if (name === "Shadows") return "text-yellow-400 animate-float-subtle drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]";
    return "text-white/40";
  };

  const levelStyle = getLevelStyle(level);

  const NavItem = ({ id, icon, label }: { id: NavTab, icon: ReactNode, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === id ? 'text-white scale-110' : 'text-white/30 hover:text-white/60'}`}
    >
      <div className={`p-2 rounded-xl transition-all ${activeTab === id ? 'bg-white/10 shadow-lg' : ''}`}>
        {icon}
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  const EquipSlot = ({ icon, label, item, slotId }: { icon: ReactNode, label: string, item?: Item | null, slotId: string }) => (
    <div 
      onClick={() => item ? setSelectedItem({ item, context: 'equipped' }) : null}
      className={`w-16 h-16 rounded-2xl border backdrop-blur-xl flex flex-col items-center justify-center gap-1 group transition-all shadow-lg ${item ? 'bg-white/10 border-white/20 cursor-pointer hover:bg-white/20' : 'bg-white/5 border-white/10 cursor-default'}`}
    >
      {item ? (
        <>
          <div className="text-white/80">
            {icon}
          </div>
          <span className="text-[6px] font-black uppercase tracking-tighter text-white/60 text-center leading-tight px-1">{item.name}</span>
        </>
      ) : (
        <>
          <div className="text-white/20 group-hover:text-white/30 transition-all">
            {icon}
          </div>
          <span className="text-[6px] font-black uppercase tracking-tighter text-white/10 group-hover:text-white/20">{label}</span>
        </>
      )}
    </div>
  );

  if (isTutorial) {
    return <TutorialBattle onVictory={handleTutorialVictory} />;
  }

  if (showSaveHeroModal) {
    return <SaveHeroModal onSave={handleSaveHero} />;
  }

  const handleSendMessage = (text: string, type: 'global' | 'clan') => {
    const newMsg = {
      id: Date.now().toString(),
      sender: username,
      text,
      type,
      timestamp: Date.now()
    };
    setChatMessages([...chatMessages, newMsg]);
  };

  const handleSystemMessage = (text: string) => {
    const newMsg = {
      id: Date.now().toString(),
      sender: 'System',
      text,
      type: 'system' as const,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-between p-6 text-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center gap-8"
          >
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4, ease: "easeInOut" }}
              className="w-32 h-32 rounded-[3rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] backdrop-blur-xl"
            >
              <Crown className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </motion.div>
            
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Свет против тьмы
              </h1>
              <p className="text-white/40 text-sm md:text-base font-bold uppercase tracking-[0.5em]">
                Nation of the Strongest
              </p>
            </div>
            
            <div className="flex flex-col gap-4 mt-8">
              <button 
                onClick={async () => {
                  try {
                    await signInWithPopup(auth, googleProvider);
                    setIsLoggedIn(true);
                    setActiveTab('hero');
                  } catch (error) {
                    console.error("Error signing in with Google:", error);
                  }
                }}
                className="px-16 py-5 bg-white/10 text-white font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white/20 transition-all border border-white/20"
              >
                Войти через Google
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full flex flex-col items-center gap-1 pb-4"
        >
          <p className="text-[10px] text-white/20 uppercase tracking-widest">Все права защищены</p>
          <a 
            href="mailto:alexeivasilev2781994@gmail.com"
            className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors font-bold"
          >
            Создатель: Rayskiy
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center pt-[90px] gap-6 overflow-x-hidden overflow-y-auto">
      {/* Fixed Header: Simplified */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] flex flex-col gap-2 pt-2 pb-2 px-2 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-end w-full px-4 py-2">
          <button 
            onClick={() => setIsMailOpen(true)}
            className="relative w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <Mail className="w-4 h-4 text-white/60" />
            {mailMessages.some(m => !m.read || (m.hasGift && !m.giftClaimed)) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#0a0a0a]" />
            )}
          </button>
        </div>
      </div>

      {/* Quota Exceeded Warning */}
      <AnimatePresence>
        {quotaExceeded && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xs px-4"
          >
            <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 shadow-2xl">
              <Activity className="w-5 h-5 text-red-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Лимит исчерпан</span>
                <span className="text-[8px] text-red-200/60 leading-tight">Ваши данные сохраняются локально. Квота обновится завтра.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resources Bar (Outside the main frame) */}
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
        {Object.entries(resources).map(([name, amount]) => (
          <div key={name} className="flex items-center gap-2 group cursor-pointer" onClick={() => alert(`${name}: ${formatNumber(amount as number)}`)}>
            <div className="p-1.5 rounded-full bg-white/5 border border-white/10">
              {name === 'silver' && <Coins className="w-4 h-4 text-slate-300" />}
              {name === 'gold' && <Coins className="w-4 h-4 text-yellow-500" />}
              {name === 'diamonds' && <Diamond className="w-4 h-4 text-cyan-400" />}
              {!['silver', 'gold', 'diamonds'].includes(name) && <Coins className="w-4 h-4 text-white/40" />}
            </div>
            <span className="text-xs font-black text-white group-hover:text-yellow-400 transition-all tracking-tight">{formatNumber(amount as number)}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'hero' && (
          <motion.div 
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-6 w-full max-w-4xl"
          >
            {/* Hero Profile Header */}
            <div className="w-full max-w-md flex flex-col items-center gap-1 mb-2">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-lg bg-white/5 border transition-all duration-1000 ${levelStyle.split(' ').filter(c => c.startsWith('border')).join(' ')}`}>
                  <span className={`text-xs font-black uppercase tracking-widest transition-all duration-1000 ${levelStyle.split(' ').filter(c => !c.startsWith('border') && !c.startsWith('shadow')).join(' ')}`}>
                    {level} lvl
                  </span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white italic">
                  {username}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${getClanNameStyle(clanName)}`}>{clanName}</span>
                <span className="text-[10px] text-white/20">•</span>
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{HERO_TITLES[Math.min(Math.max(level - 1, 0), 49)]}</span>
              </div>
            </div>

            <div className="flex items-start gap-8 w-full justify-center">
              {/* Left Equipment Slots */}
              <div className="flex flex-col gap-4 h-[480px] justify-between">
                <EquipSlot icon={<HardHat className="w-6 h-6" />} label="Шлем" item={equippedItems.helmet} slotId="helmet" />
                <EquipSlot icon={<Shirt className="w-6 h-6" />} label="Броня" item={equippedItems.armor} slotId="armor" />
                <EquipSlot icon={<Hand className="w-6 h-6" />} label="Наручи" item={equippedItems.bracers} slotId="bracers" />
                <EquipSlot icon={<Sword className="w-6 h-6" />} label="Оружие" item={equippedItems.weapon} slotId="weapon" />
                <EquipSlot icon={<Zap className="w-6 h-6" />} label="Пояс" item={equippedItems.belt} slotId="belt" />
              </div>

              {/* Avatar Container */}
              <div className={`w-[240px] h-[480px] rounded-[3rem] bg-black/40 border backdrop-blur-3xl overflow-hidden flex flex-col items-center justify-center relative group transition-all duration-1000 ${getAvatarBorderStyle(level)}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none z-0" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent)] pointer-events-none z-0" />
                
                {/* Character Silhouette/Avatar Removed */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mt-4 w-24 h-2 bg-white/5 rounded-full blur-sm" />
                </div>

                {/* Power Level Indicator */}
                <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-1 z-20">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Боевая мощь</span>
                  <span className="text-3xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    {formatNumber(Number(totalStats.str * 10 + totalStats.agi * 5 + totalStats.end * 20))}
                  </span>
                </div>
              </div>

              {/* Right Equipment Slots */}
              <div className="flex flex-col gap-4 h-[480px] justify-between">
                <EquipSlot icon={<Gem className="w-6 h-6" />} label="Амулет" item={equippedItems.amulet} slotId="amulet" />
                <EquipSlot icon={<Axe className="w-6 h-6" />} label="Втор. ор." item={equippedItems.secondary} slotId="secondary" />
                <EquipSlot icon={<Columns2 className="w-6 h-6" />} label="Штаны" item={equippedItems.pants} slotId="pants" />
                <EquipSlot icon={<Footprints className="w-6 h-6" />} label="Сапоги" item={equippedItems.boots} slotId="boots" />
                <EquipSlot icon={<Circle className="w-6 h-6" />} label="Кольцо" item={equippedItems.ring} slotId="ring" />
              </div>
            </div>

            {/* HP and XP Bars moved here - Between avatar and stats */}
            <div className="w-full max-w-md flex flex-col gap-2 px-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest w-6">HP</span>
                <div className="flex-1 h-4 bg-black/50 rounded-full overflow-hidden relative border border-white/5">
                  <div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300" style={{ width: `${(hp / maxHp) * 100}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md">{formatNumber(hp)} / {formatNumber(maxHp)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest w-6">XP</span>
                <div className="flex-1 h-4 bg-black/50 rounded-full overflow-hidden relative border border-white/5">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300" style={{ width: `${(xp / requiredXp) * 100}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md">{formatNumber(xp)} / {formatNumber(requiredXp)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'hero' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-6 flex flex-col gap-4 pb-32"
          >
            {/* Stats Window Moved Below Backpack */}
            <div className="w-full p-4 flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
              <div className="text-xs font-black uppercase tracking-widest text-white/60 text-center mb-2">Характеристики</div>
              {freeStatPoints > 0 && (
                <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2 mb-2">
                  <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Свободных очков: {freeStatPoints}</span>
                  <button 
                    onClick={autoDistributeStats}
                    className="text-[8px] font-black uppercase tracking-widest bg-yellow-500 text-black px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-all shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                  >
                    Авто
                  </button>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider group">
                  <div className="flex items-center gap-2">
                    <Sword className="w-3 h-3 text-red-500" />
                    <span className="text-white/60 group-hover:text-white transition-colors">Сила</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    {freeStatPoints > 0 && (
                      <button onClick={() => { setAssignedStats(prev => ({ ...prev, str: prev.str + 1 })); setFreeStatPoints(prev => prev - 1); }} className="text-emerald-400 font-bold">+</button>
                    )}
                    <motion.span 
                      key={`base-str-${baseStats.str}`}
                      initial={{ color: "#fff" }}
                      animate={{ color: ["#fff", "#f59e0b", "#fff"] }}
                      transition={{ duration: 0.5 }}
                      className="text-white"
                    >
                      {baseStats.str}
                    </motion.span>
                    {itemStats.str > 0 && <span className="text-emerald-400">+{itemStats.str}</span>}
                    {buffStats.str > 0 && <span className="text-yellow-400">+{buffStats.str}</span>}
                    <motion.span 
                      key={`total-str-${totalStats.str}`}
                      initial={{ color: "#f87171" }}
                      animate={{ color: ["#f87171", "#f59e0b", "#f87171"] }}
                      transition={{ duration: 0.5 }}
                      className="text-red-400 ml-1"
                    >
                      ={totalStats.str}
                    </motion.span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider group">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-white/60 group-hover:text-white transition-colors">Ловкость</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    {freeStatPoints > 0 && (
                      <button onClick={() => { setAssignedStats(prev => ({ ...prev, agi: prev.agi + 1 })); setFreeStatPoints(prev => prev - 1); }} className="text-emerald-400 font-bold">+</button>
                    )}
                    <motion.span 
                      key={`base-agi-${baseStats.agi}`}
                      initial={{ color: "#fff" }}
                      animate={{ color: ["#fff", "#f59e0b", "#fff"] }}
                      transition={{ duration: 0.5 }}
                      className="text-white"
                    >
                      {baseStats.agi}
                    </motion.span>
                    {itemStats.agi > 0 && <span className="text-emerald-400">+{itemStats.agi}</span>}
                    {buffStats.agi > 0 && <span className="text-yellow-400">+{buffStats.agi}</span>}
                    <motion.span 
                      key={`total-agi-${totalStats.agi}`}
                      initial={{ color: "#f87171" }}
                      animate={{ color: ["#f87171", "#f59e0b", "#f87171"] }}
                      transition={{ duration: 0.5 }}
                      className="text-red-400 ml-1"
                    >
                      ={totalStats.agi}
                    </motion.span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider group">
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span className="text-white/60 group-hover:text-white transition-colors">Интуиция</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    {freeStatPoints > 0 && (
                      <button onClick={() => { setAssignedStats(prev => ({ ...prev, int: prev.int + 1 })); setFreeStatPoints(prev => prev - 1); }} className="text-emerald-400 font-bold">+</button>
                    )}
                    <motion.span 
                      key={`base-int-${baseStats.int}`}
                      initial={{ color: "#fff" }}
                      animate={{ color: ["#fff", "#f59e0b", "#fff"] }}
                      transition={{ duration: 0.5 }}
                      className="text-white"
                    >
                      {baseStats.int}
                    </motion.span>
                    {itemStats.int > 0 && <span className="text-emerald-400">+{itemStats.int}</span>}
                    {buffStats.int > 0 && <span className="text-yellow-400">+{buffStats.int}</span>}
                    <motion.span 
                      key={`total-int-${totalStats.int}`}
                      initial={{ color: "#f87171" }}
                      animate={{ color: ["#f87171", "#f59e0b", "#f87171"] }}
                      transition={{ duration: 0.5 }}
                      className="text-red-400 ml-1"
                    >
                      ={totalStats.int}
                    </motion.span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider group">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span className="text-white/60 group-hover:text-white transition-colors">Выносливость</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    {freeStatPoints > 0 && (
                      <button onClick={() => { setAssignedStats(prev => ({ ...prev, end: prev.end + 1 })); setFreeStatPoints(prev => prev - 1); }} className="text-emerald-400 font-bold">+</button>
                    )}
                    <motion.span 
                      key={`base-end-${baseStats.end}`}
                      initial={{ color: "#fff" }}
                      animate={{ color: ["#fff", "#f59e0b", "#fff"] }}
                      transition={{ duration: 0.5 }}
                      className="text-white"
                    >
                      {baseStats.end}
                    </motion.span>
                    {itemStats.end > 0 && <span className="text-emerald-400">+{itemStats.end}</span>}
                    {buffStats.end > 0 && <span className="text-yellow-400">+{buffStats.end}</span>}
                    <motion.span 
                      key={`total-end-${totalStats.end}`}
                      initial={{ color: "#f87171" }}
                      animate={{ color: ["#f87171", "#f59e0b", "#f87171"] }}
                      transition={{ duration: 0.5 }}
                      className="text-red-400 ml-1"
                    >
                      ={totalStats.end}
                    </motion.span>
                  </div>
                </div>
                
                {level >= 30 && (
                  <>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider group">
                      <div className="flex items-center gap-2">
                        <Book className="w-3 h-3 text-purple-500" />
                        <span className="text-white/60 group-hover:text-white transition-colors">Интеллект</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        {freeStatPoints > 0 && (
                          <button onClick={() => { setAssignedStats(prev => ({ ...prev, intel: prev.intel + 1 })); setFreeStatPoints(prev => prev - 1); }} className="text-emerald-400 font-bold">+</button>
                        )}
                        <motion.span 
                          key={`base-intel-${baseStats.intel}`}
                          initial={{ color: "#fff" }}
                          animate={{ color: ["#fff", "#f59e0b", "#fff"] }}
                          transition={{ duration: 0.5 }}
                          className="text-white"
                        >
                          {baseStats.intel}
                        </motion.span>
                        {itemStats.intel > 0 && <span className="text-emerald-400">+{itemStats.intel}</span>}
                        {buffStats.intel > 0 && <span className="text-yellow-400">+{buffStats.intel}</span>}
                        <motion.span 
                          key={`total-intel-${totalStats.intel}`}
                          initial={{ color: "#f87171" }}
                          animate={{ color: ["#f87171", "#f59e0b", "#f87171"] }}
                          transition={{ duration: 0.5 }}
                          className="text-red-400 ml-1"
                        >
                          ={totalStats.intel}
                        </motion.span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider group">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-cyan-500" />
                        <span className="text-white/60 group-hover:text-white transition-colors">Мудрость</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        {freeStatPoints > 0 && (
                          <button onClick={() => { setAssignedStats(prev => ({ ...prev, wis: prev.wis + 1 })); setFreeStatPoints(prev => prev - 1); }} className="text-emerald-400 font-bold">+</button>
                        )}
                        <motion.span 
                          key={`base-wis-${baseStats.wis}`}
                          initial={{ color: "#fff" }}
                          animate={{ color: ["#fff", "#f59e0b", "#fff"] }}
                          transition={{ duration: 0.5 }}
                          className="text-white"
                        >
                          {baseStats.wis}
                        </motion.span>
                        {itemStats.wis > 0 && <span className="text-emerald-400">+{itemStats.wis}</span>}
                        {buffStats.wis > 0 && <span className="text-yellow-400">+{buffStats.wis}</span>}
                        <motion.span 
                          key={`total-wis-${totalStats.wis}`}
                          initial={{ color: "#f87171" }}
                          animate={{ color: ["#f87171", "#f59e0b", "#f87171"] }}
                          transition={{ duration: 0.5 }}
                          className="text-red-400 ml-1"
                        >
                          ={totalStats.wis}
                        </motion.span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Player Stats Section */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                <div className="text-xs font-black uppercase tracking-widest text-white/60 text-center mb-2">Статистика</div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex justify-between"><span className="text-white/40">Дуэли:</span><span className="text-white">{playerStats.duel.wins}/{playerStats.duel.losses}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">2x2:</span><span className="text-white">{playerStats.battle2v2.wins}/{playerStats.battle2v2.losses}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Отряды:</span><span className="text-white">{playerStats.squadBattle.wins}/{playerStats.squadBattle.losses}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Королевская:</span><span className="text-white">{playerStats.battleRoyale.wins}/{playerStats.battleRoyale.losses}</span></div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span className="text-white/60">Сюжет</span>
                    <span className="text-white">{playerStats.storyCompletion}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${playerStats.storyCompletion}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Section */}
            <div className="w-full p-4 flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
              <div className="text-xs font-black uppercase tracking-widest text-white/60 text-center mb-2">Наставничество</div>
              {level < 20 ? (
                mentor ? (
                  <div className="text-center text-[10px] font-bold text-white/80">Ваш наставник: <span className="text-emerald-400">{mentor}</span></div>
                ) : (
                  <button 
                    onClick={() => {
                      const name = prompt("Введите имя наставника:");
                      if (name) setMentor(name);
                    }}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Выбрать наставника
                  </button>
                )
              ) : (
                <div className="text-center text-[10px] font-bold text-white/80">
                  Вы можете быть наставником для новичков.
                </div>
              )}
            </div>

            {/* Backpack Toggle Button */}
            <button 
              onClick={() => setIsBackpackOpen(!isBackpackOpen)}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg backdrop-blur-xl mt-4"
            >
              <Box className="w-5 h-5 text-white/60" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Рюкзак</span>
              <ChevronRight className={`w-4 h-4 text-white/40 transition-all ${isBackpackOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Expanded Backpack */}
            <AnimatePresence>
              {isBackpackOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col gap-4 backdrop-blur-xl">
                    {/* Backpack Tabs */}
                    <div className="flex bg-black/40 rounded-2xl p-1">
                      {[
                        { id: 'weapon', label: 'Оружие' },
                        { id: 'armor', label: 'Доспехи' },
                        { id: 'elixir', label: 'Эликсиры' },
                        { id: 'book', label: 'Книги' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveBackpackTab(tab.id as any)}
                          className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeBackpackTab === tab.id ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Backpack Items Grid */}
                    <div className="grid grid-cols-5 gap-2 min-h-[120px]">
                      {(() => {
                        const openSlots = 20;
                        const totalSlots = 20;
                        const closedSlots = 0;
                        
                        // Filter items by active tab
                        const filteredItems = backpackItems.filter(item => {
                          if (typeof item === 'string') return false; // Handle legacy string items if any
                          return item.type === activeBackpackTab;
                        });

                        return (
                          <>
                            {filteredItems.map((item: Item) => (
                              <div 
                                key={item.id} 
                                onClick={() => setSelectedItem({ item, context: 'backpack' })}
                                className="aspect-square rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-2 gap-1 hover:bg-white/10 transition-all cursor-pointer group relative"
                              >
                                {item.type === 'weapon' && <Sword className="w-6 h-6 text-white/40 group-hover:text-white/80 transition-all" />}
                                {item.type === 'armor' && <Shield className="w-6 h-6 text-white/40 group-hover:text-white/80 transition-all" />}
                                {item.type === 'elixir' && <FlaskConical className="w-6 h-6 text-white/40 group-hover:text-white/80 transition-all" />}
                                {item.type === 'book' && <Book className="w-6 h-6 text-white/40 group-hover:text-white/80 transition-all" />}
                                <span className="text-[6px] font-black uppercase text-center text-white/60 leading-tight truncate w-full px-1">{item.name}</span>
                                {item.level && <span className="absolute top-1 right-1 text-[8px] font-bold text-yellow-400">{item.level}</span>}
                              </div>
                            ))}
                            
                            {/* Empty open slots */}
                            {Array.from({ length: Math.max(0, openSlots - filteredItems.length) }).map((_, i) => (
                              <div key={`empty-${i}`} className="aspect-square rounded-xl bg-black/20 border border-white/5" />
                            ))}

                            {/* Closed slots */}
                            {Array.from({ length: closedSlots }).map((_, i) => (
                              <div key={`closed-${i}`} className="aspect-square rounded-xl bg-black/40 border border-red-500/10 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,0,0,0.05)_5px,rgba(255,0,0,0.05)_10px)]" />
                                <Lock className="w-4 h-4 text-red-500/30" />
                              </div>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'clan' && (
          <ClanSection 
            currentClan={clanName}
            onJoinClan={(name) => setClanName(name)}
            onCreateClan={(name) => setClanName(name)}
          />
        )}

        {activeTab === 'city' && (
          <CitySection 
            resources={resources}
            setResources={setResources}
            bankAccount={bankAccount}
            setBankAccount={setBankAccount}
            currentCity={currentCity}
            setCurrentCity={setCurrentCity}
            injuries={injuries}
            setInjuries={setInjuries}
            onGlobalMessage={handleSystemMessage}
            blessing={blessing}
            setBlessing={setBlessing}
            inventory={backpackItems}
            setInventory={setBackpackItems}
            equippedItems={equippedItems}
            setEquippedItems={setEquippedItems}
            buffStats={buffStats}
            setBuffStats={setBuffStats}
          />
        )}

        {activeTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md px-4 flex flex-col gap-4 pb-32"
          >
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 backdrop-blur-xl">
              <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white text-center mb-4">Настройки</h2>
              
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Ваш уникальный ID (Не меняется)</span>
                  <div className="px-4 py-3 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-2">
                    <Hash className="w-4 h-4 text-white/20" />
                    <span className="text-sm font-mono text-white/60 tracking-widest">{playerId}</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500/80 ml-2">Сменить ID (только для админов)</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newPlayerIdInput}
                          onChange={(e) => setNewPlayerIdInput(e.target.value)}
                          placeholder="Новый ID"
                          className="flex-1 bg-white/5 border border-yellow-500/30 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-yellow-500/50 transition-all"
                        />
                        <button 
                          onClick={handleChangePlayerId}
                          disabled={!newPlayerIdInput.trim() || newPlayerIdInput === playerId}
                          className="px-6 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 font-black uppercase tracking-widest rounded-2xl text-[10px] transition-all disabled:opacity-50"
                        >
                          Сменить
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleResetAllHeroes}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-500 font-black uppercase tracking-widest hover:bg-red-500/40 transition-all"
                    >
                      <Skull className="w-5 h-5" />
                      Обнулить всех героев
                    </button>

                    <button 
                      onClick={handleRegenerateAllIds}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 font-black uppercase tracking-widest hover:bg-yellow-500/40 transition-all"
                    >
                      <Hash className="w-5 h-5" />
                      Обновить всем ID
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Сменить никнейм</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newUsernameInput}
                      onChange={(e) => {
                        setNewUsernameInput(e.target.value);
                        setUsernameError(null);
                      }}
                      placeholder="Только англ. буквы (4-12)"
                      className={`flex-1 bg-white/5 border ${usernameError ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-white/30 transition-all`}
                    />
                    <button 
                      onClick={handleChangeUsername}
                      disabled={!newUsernameInput.trim() || newUsernameInput === username}
                      className="px-6 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] transition-all disabled:opacity-50"
                    >
                      Сменить
                    </button>
                  </div>
                  {usernameError && (
                    <span className="text-[10px] font-bold text-red-500 ml-2">{usernameError}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <GraphicsSettings settings={graphicsSettings} onUpdate={setGraphicsSettings} />
                {/* Hide Account Toggle */}
                <button 
                  onClick={() => setIsAccountHidden(!isAccountHidden)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${isAccountHidden ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-black uppercase tracking-widest text-white">Скрыть аккаунт</span>
                    <span className="text-[10px] text-white/30">Скрывает ваш профиль от других игроков</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-all ${isAccountHidden ? 'bg-white' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${isAccountHidden ? 'right-1 bg-black' : 'left-1 bg-white/40'}`} />
                  </div>
                </button>

                {/* Full Screen Toggle */}
                <button 
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen().catch(err => console.error(err));
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-black uppercase tracking-widest text-white">На весь экран</span>
                    <span className="text-[10px] text-white/30">Развернуть игру на весь экран</span>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-white/10 relative">
                    <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white/40" />
                  </div>
                </button>

                {/* Logout Button */}
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-black uppercase tracking-widest text-white">Выйти с аккаунта</span>
                    <span className="text-[10px] text-white/30">Вернуться на начальный экран</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all" />
                </button>

                {/* Delete Account Button */}
                <button 
                  onClick={() => {
                    if (window.confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.")) {
                      setIsLoggedIn(false);
                      // Reset other states if needed
                    }
                  }}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-black uppercase tracking-widest text-red-500">Удалить аккаунт</span>
                    <span className="text-[10px] text-red-500/40">Полное удаление всех данных</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-500/20 group-hover:text-red-500 transition-all" />
                </button>
              </div>
            </div>

            {/* Admin Panel Section */}
            {isAdmin && (
              <AdminPanel 
                onAddResources={addResources} 
                onSetLevel={setPlayerLevel}
                onHardReset={handleResetAllHeroes}
                currentUser={username}
                currentClan={clanName}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'community' && <CommunitySection key="community" />}
        {activeTab === 'ranking' && <RankingSection key="ranking" />}

        {activeTab === 'home' && (
          <CityCenter key="home" userLevel={level} onLocationSelect={setCurrentLocation} />
        )}

        {activeTab === 'battle' && (
          <BattleSection key="battle" userLevel={level} onVictory={handleBattleVictory} location={currentLocation || undefined} />
        )}
      </AnimatePresence>

      {/* Bottom Navigation Pill */}
      <div className="fixed bottom-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl flex items-center justify-between w-full max-w-sm z-50">
        <NavItem id="city" icon={<Home className="w-5 h-5" />} label="Город" />
        <NavItem id="battle" icon={<Sword className="w-5 h-5" />} label="Бой" />
        <NavItem id="hero" icon={<User className="w-5 h-5" />} label="Герой" />
        <NavItem id="clan" icon={<Users className="w-5 h-5" />} label="Клан" />
        <NavItem id="community" icon={<Globe className="w-5 h-5" />} label="Мир" />
        <NavItem id="ranking" icon={<Trophy className="w-5 h-5" />} label="Рейтинг" />
        <NavItem id="settings" icon={<Settings className="w-5 h-5" />} label="Опции" />
      </div>

      {/* Modals */}
      <MailModal 
        isOpen={isMailOpen} 
        onClose={() => setIsMailOpen(false)} 
        messages={mailMessages}
        onRead={handleReadMail}
        onClaimGift={handleClaimGift}
      />
      
      {selectedItem && (
        <ItemModal 
          item={selectedItem.item}
          context={selectedItem.context}
          onClose={() => setSelectedItem(null)}
          onEquip={handleEquip}
          onUnequip={handleUnequip}
          onDismantle={handleDismantle}
          onDiscard={handleDiscard}
          onStore={handleStore}
          onClanStore={handleClanStore}
        />
      )}
    </div>
  );
}
