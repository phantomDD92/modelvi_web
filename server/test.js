// const original = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

// // 1. Fisher-Yates shuffle (unbiased)
// function shuffleArray(arr) {
//   const a = arr.slice();
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

// const shuffled1 = shuffleArray(original);
// console.log("Original:", original);
// console.log("Shuffled (Fisher-Yates):", shuffled1);
