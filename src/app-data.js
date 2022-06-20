export default class AppData {
  constructor() {
    this.food = [];
  }

  addFood(carbs, protein, fat) {
    this.food.push({
      carbs: +carbs,
      protein: +protein,
      fat: +fat
    });
  }

  getTotalCarbs() {
    return this.food.reduce((total, current) => {
      return total + current.carbs;
    }, 0);
  }

  getTotalProtein() {
    return this.food.reduce((total, current) => {
      return total + current.protein;
    }, 0);
  }

  getTotalFat() {
    return this.food.reduce((total, current) => {
      return total + current.fat;
    }, 0);
  }

  getTotalCalories() {
    return (
      (this.getTotalCarbs() + this.getTotalProtein()) * 4 +
      this.getTotalFat() * 9
    );
  }
}
