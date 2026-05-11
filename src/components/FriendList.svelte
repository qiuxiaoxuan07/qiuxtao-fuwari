<script lang="ts">
import { onMount } from "svelte";

type Friend = {
	title: string;
	url: string;
	avatar: string;
	description: string;
};

// 定义传入的数据类型
export let friends: Friend[] = [];

// 用于显示的列表，初始时直接使用原顺序（防止服务端渲染时空白）
let displayFriends = friends;

// 随机打乱函数
function shuffleArray<T>(array: T[]) {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

// 组件挂载后（在浏览器端运行）执行打乱
onMount(() => {
	displayFriends = shuffleArray(friends);
});
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {#each displayFriends as friend}
    <a 
      href={friend.url} 
      target="_blank" 
      rel="noopener noreferrer"
      class="group flex items-center p-4 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--btn-regular-bg-hover)] transition-all border border-black/5 dark:border-white/10 hover:scale-[1.02]"
    >
      <img 
        src={friend.avatar} 
        alt={friend.title} 
        class="w-14 h-14 rounded-full mr-4 object-cover shadow-sm bg-white" 
      />
      <div class="flex flex-col min-w-0">
        <span class="font-bold text-lg text-black/75 dark:text-white/75 group-hover:text-[var(--primary)] transition-colors truncate">
          {friend.title}
        </span>
        <span class="text-sm text-black/40 dark:text-white/40 truncate">
          {friend.description}
        </span>
      </div>
    </a>
  {/each}
</div>
