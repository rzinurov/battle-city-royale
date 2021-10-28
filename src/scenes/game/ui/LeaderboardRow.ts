import Animations from "~/consts/Animations";
import Tank from "../objects/Tank";

export default class LeaderboardRow {
  username: string;
  score: integer;
  color: number;
  sprite: string;

  constructor(tank: Tank) {
    this.username = tank.username;
    this.score = tank.score;
    this.color = tank.color;
    this.sprite = Animations[tank.animationPrefix].MoveUp;
  }
}
