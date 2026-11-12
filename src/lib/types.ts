export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export type Evaluation = {
  id: number; skill: number; skill_name: string; category: number; category_name: string;
  value: number; modified_by: string; modified_at: string;
};

export type Player = {
  id: number; name: string; first_name: string; address: string; post_code: string; city: string;
  society: string; date_of_birth: string; phone_number: string; email_address: string;
  image: string | null; average_rating: number | null; evaluations?: Evaluation[];
};

export type Skill = { id: number; skill_name: string; comment: string; category: number; category_name: string };
export type Category = { id: number; name: string };

/** A simulation step: absolute board positions items move to in this step (missing ids stay where they were). */
export type BoardStep = { id: string; pos: Record<string, [number, number]> };
export type BoardState = { pitch: PitchKind; items: BoardItem[]; steps?: BoardStep[] };
export type PitchKind =
  | "full" | "half" | "box" | "fullPortrait" | "halfPortrait"
  | "blank" | "grey" | "white" | "whitePortrait" | "futsal" | "futsalPortrait";
export type BoardItem =
  | { id: string; kind: "player"; x: number; y: number; team: "home" | "away" | "neutral"; label: string }
  | { id: string; kind: "ball" | "cone" | "goal"; x: number; y: number; rot?: number }
  | { id: string; kind: "arrow"; style: "run" | "pass" | "dribble"; points: [number, number][] }
  | { id: string; kind: "text"; x: number; y: number; text: string }
  | { id: string; kind: "zone"; x: number; y: number; w: number; h: number };

export type Plan = {
  id: number; title: string; image: string; board: Partial<BoardState>; tags: string[]; created_at: string; created_by: string; comment: string; share_token: string | null;
};

export type Dashboard = {
  players: number; skills: number; plans: number; evaluations: number;
  top_players: { id: number; name: string; image: string | null; average: number }[];
  category_averages: { category: string; average: number; count: number }[];
  recent_plans: Plan[];
};

export type ClubInfo = {
  name: string; status: "trialing" | "active" | "past_due" | "canceled"; entitled: boolean; role: "owner" | "coach" | "viewer";
  trial_ends_at: string | null; trial_days_left: number; current_period_end: string | null; billing_configured: boolean;
};
export type Me = { username: string; club: ClubInfo };

export type TeamData = {
  seats_limit: number; seats_used: number;
  members: { id: number; username: string; email: string; role: string }[];
  invites: { id: number; email: string; role: string; token?: string; created_at: string }[];
};
export type SharedPlan = { title: string; comment: string; image: string; board: Partial<BoardState>; created_at: string; club_name: string };