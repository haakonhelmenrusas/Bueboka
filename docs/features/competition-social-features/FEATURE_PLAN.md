# Bueboka Competition & Social Features - Feature Plan

## Overview

This document outlines three innovative feature ideas to expand competition capabilities in the Bueboka ecosystem (Mobile App, Website, and API). These features are designed to enhance how archers can compete with each other beyond individual competition tracking.

**Current State:**
- Individual competition tracking (date, name, location, rounds, scores, placement)
- Public archer profiles (skyttere) with search capability
- Practice and equipment tracking
- Personal statistics and achievements

**Goal:** Enable more interactive, social, and competitive experiences between archers.

---

## Idea 1: Head-to-Head Challenges (1v1 Duels)

### Concept
Archers can challenge each other to direct 1v1 competitions, creating a gamified social competition layer.

### User Value
- Direct competition with friends and rivals
- Scheduled or instant challenges
- builds community engagement
- Adds social accountability for practice

### Implementation Scope

#### Mobile App Changes
- **New Screen**: `app/challenges.tsx` - Challenge dashboard
- **New Screen**: `app/challenges/[id].tsx` - Challenge details
- **New Screen**: `app/challenges/create.tsx` - Create challenge form
- **Components**: 
  - `ChallengeCard.tsx` - Display active/incoming challenges
  - `ChallengeForm.tsx` - Create/edit challenge
  - `ChallengeResult.tsx` - Show completed challenge results
- **Repository**: `challengeRepository.ts` - New CRUD operations
- **Types**: `Challenge.ts`, `ChallengeStatus.ts`

#### Website Changes
- **New Page**: `/utfordringer` (challenges) - Browse and manage challenges
- **API Routes**: `/api/challenges` (CRUD), `/api/challenges/[id]/accept`, `/api/challenges/[id]/complete`
- **Components**: `ChallengeList`, `ChallengeDetail`

#### API/Database Changes
- **New Model**: `Challenge` table
  ```prisma
  model Challenge {
    id            String   @id @default(cuid())
    challengerId  String   // User who created the challenge
    challengedId String   // User being challenged
    name         String   // Challenge name/title
    description  String?  // Optional description
    roundTypeId  String?  // Link to predefined round type
    customRules  Json?    // Custom rules if not using round type
    startDate    DateTime?
    endDate      DateTime?
    status       ChallengeStatus @default(PENDING)
    winnerId     String?  // User ID of winner
    
    // Scores
    challengerScore Int?
    challengedScore Int?
    challengerTotalArrows Int?
    challengedTotalArrows Int?
    
    // Meta
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    
    // Relations
    challenger  User @relation(fields: [challengerId], references: [id])
    challenged  User @relation(fields: [challengedId], references: [id])
    winner      User? @relation(fields: [winnerId], references: [id])
    roundType   RoundType? @relation(fields: [roundTypeId], references: [id])
    
    @@index([challengerId])
    @@index([challengedId])
    @@index([status])
  }
  
  enum ChallengeStatus {
    PENDING
    ACCEPTED
    DECLINED
    COMPLETED
    CANCELLED
  }
  ```

- **New API Endpoints**:
  - `GET /api/challenges` - List user's challenges (incoming, outgoing, completed)
  - `GET /api/challenges/:id` - Get challenge details
  - `POST /api/challenges` - Create new challenge
  - `PATCH /api/challenges/:id/accept` - Accept challenge
  - `PATCH /api/challenges/:id/decline` - Decline challenge
  - `PATCH /api/challenges/:id/cancel` - Cancel challenge (challenger only)
  - `POST /api/challenges/:id/submit` - Submit scores

#### User Flow
1. User navigates to Challenges tab
2. Click "New Challenge" button
3. Select opponent from friends/public profiles
4. Choose round type or define custom rules (distance, arrows, target type)
5. Set optional date/time range
6. Send challenge
7. Opponent receives notification and can accept/decline
8. Both users record their scores
9. System determines winner based on total score
10. Results displayed and winner notified

#### Offline Support
- Challenges queued for sync
- Local storage of accepted challenges
- Score submission works offline

#### Norwegian Terms
- Utfordring = Challenge
- Utfordrer = Challenger
- Utfordret = Challenged
- Godta = Accept
- Avslå = Decline

### Technical Considerations
- **Notifications**: Push notifications for new challenges, reminders, completions
- **Validation**: Ensure both users have appropriate equipment for chosen round type
- **Scoring**: Automatic winner determination based on score comparison
- **Privacy**: Respect user privacy settings (only challenge public profiles or friends)

### Priority: HIGH
- Core social feature that directly addresses the request
- Builds on existing public profile system
- Relatively straightforward implementation

---

## Idea 2: Virtual Leagues & Tournaments

### Concept
Create organized multi-player competitions where archers can join leagues or tournaments, compete over time, and track rankings on leaderboards.

### User Value
- Structured competition beyond 1v1
- Seasonal or ongoing leagues
- Community building through shared goals
- Motivational ranking system

### Implementation Scope

#### Mobile App Changes
- **New Screens**:
  - `app/leagues.tsx` - League browser
  - `app/leagues/[id].tsx` - League details
  - `app/leagues/[id]/join.tsx` - Join league
  - `app/leagues/[id]/leaderboard.tsx` - League rankings
- **Components**:
  - `LeagueCard.tsx` - League summary
  - `LeagueLeaderboard.tsx` - Ranking display
  - `LeagueStanding.tsx` - Individual standing in league
- **Repository**: `leagueRepository.ts`, `leagueMemberRepository.ts`, `leagueRoundRepository.ts`
- **Types**: `League.ts`, `LeagueMember.ts`, `LeagueRound.ts`

#### Website Changes
- **New Pages**:
  - `/ligaer` (leagues) - Browse leagues
  - `/ligaer/[id]` - League details and leaderboard
  - `/ligaer/[id]/resultater` - Round results
- **API Routes**: `/api/leagues`, `/api/leagues/[id]/join`, `/api/leagues/[id]/rounds`
- **Components**: `LeagueList`, `LeagueDetail`, `Leaderboard`

#### API/Database Changes
- **New Models**:
  ```prisma
  model League {
    id          String   @id @default(cuid())
    name        String   // League name
    description String?  // League description
    organizerId String   // User who created the league
    type        LeagueType @default(SEASONAL)
    startDate   DateTime
    endDate     DateTime?
    maxMembers  Int?    // Maximum participants
    status      LeagueStatus @default(OPEN)
    category    PracticeCategory? // Filter by archery type
    
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
    
    // Relations
    organizer User @relation(fields: [organizerId], references: [id])
    members   LeagueMember[]
    rounds    LeagueRound[]
    
    @@index([organizerId])
    @@index([type])
    @@index([status])
  }
  
  enum LeagueType {
    SEASONAL    // Fixed duration with schedule
    ONGOING     // Continuous, rolling
    TOURNAMENT  // Single elimination or round-robin
  }
  
  enum LeagueStatus {
    DRAFT
    OPEN
    STARTED
    COMPLETED
    CANCELLED
  }
  
  model LeagueMember {
    id        String   @id @default(cuid())
    leagueId  String
    userId    String
    joinDate  DateTime @default(now())
    points    Int      @default(0)  // Accumulated points
    rank      Int?     // Current rank
    
    // Relations
    league  League @relation(fields: [leagueId], references: [id], onDelete: Cascade)
    user    User    @relation(fields: [userId], references: [id])
    
    @@unique([leagueId, userId])
    @@index([leagueId])
    @@index([userId])
  }
  
  model LeagueRound {
    id          String   @id @default(cuid())
    leagueId    String
    name        String   // Round name
    description String?
    startDate   DateTime
    endDate     DateTime
    roundTypeId String?  // Standard round type
    customRules Json?    // Custom configuration
    
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
    
    // Relations
    league   League   @relation(fields: [leagueId], references: [id], onDelete: Cascade)
    roundType RoundType? @relation(fields: [roundTypeId], references: [id])
    results  LeagueRoundResult[]
    
    @@index([leagueId])
  }
  
  model LeagueRoundResult {
    id          String   @id @default(cuid())
    leagueRoundId String
    userId      String
    score       Int
    arrowsShot  Int?
    targetScore Int?
    submissionDate DateTime @default(now())
    
    // Relations
    leagueRound LeagueRound @relation(fields: [leagueRoundId], references: [id], onDelete: Cascade)
    user        User        @relation(fields: [userId], references: [id])
    
    @@unique([leagueRoundId, userId])
    @@index([leagueRoundId])
  }
  ```

- **New API Endpoints**:
  - `GET /api/leagues` - List available leagues
  - `GET /api/leagues/:id` - Get league details
  - `POST /api/leagues` - Create new league (authenticated)
  - `POST /api/leagues/:id/join` - Join a league
  - `POST /api/leagues/:id/leave` - Leave a league
  - `GET /api/leagues/:id/members` - Get league members
  - `GET /api/leagues/:id/leaderboard` - Get league rankings
  - `GET /api/leagues/:id/rounds` - Get league rounds
  - `POST /api/leagues/:id/rounds/:roundId/submit` - Submit round results

#### User Flow
1. **Browse Leagues**: User explores available leagues (public or invite-only)
2. **Join League**: User joins an open league or requests to join a private one
3. **League Dashboard**: View current standings, upcoming rounds, personal stats
4. **Participate**: Complete rounds by recording practice/competition scores
5. **Leaderboard**: Track progress against other members
6. **Completion**: League ends, final rankings published, achievements awarded

#### League Types
1. **Seasonal**: Fixed duration (e.g., 3 months) with weekly rounds
2. **Ongoing**: Continuous league with monthly scoring
3. **Tournament**: Single elimination or round-robin bracket

#### Scoring System
- Points awarded based on performance in each round
- Can be configured per league (e.g., top 3 get points, or proportional scoring)
- Tie-breaker rules (e.g., most 10s, arrow count, etc.)

#### Norwegian Terms
- Liga = League
- Turnering = Tournament
- Medaljetabell = Leaderboard
- Runde = Round
- Deltaker = Participant
- Poeng = Points

### Technical Considerations
- **Performance**: Leaderboards need efficient queries (materialized views or caching)
- **Scheduling**: Automated round creation and reminders
- **Flexibility**: Support different scoring systems per league
- **Moderation**: League organizers need management capabilities

### Priority: MEDIUM-HIGH
- More complex but higher community value
- Requires more infrastructure
- Can be built incrementally (start with basic leagues)

---

## Idea 3: Shared Goals & Group Challenges

### Concept
Archers form teams or groups and work together (or compete) on shared goals, such as total arrows shot, average score improvement, or streak challenges.

### User Value
- Team-based motivation
- Collaborative competition (co-op vs. cooperative)
- Group accountability
- Social recognition for achievements

### Implementation Scope

#### Mobile App Changes
- **New Screens**:
  - `app/groups.tsx` - Group dashboard
  - `app/groups/[id].tsx` - Group details
  - `app/groups/create.tsx` - Create group
  - `app/groups/[id]/goals.tsx` - Group goals
- **Components**:
  - `GroupCard.tsx` - Group summary
  - `GroupMemberList.tsx` - Members display
  - `GroupGoalProgress.tsx` - Shared goal tracking
  - `GroupActivity.tsx` - Recent group activity
- **Repository**: `groupRepository.ts`, `groupMemberRepository.ts`, `groupGoalRepository.ts`
- **Types**: `Group.ts`, `GroupMember.ts`, `GroupGoal.ts`, `GoalType.ts`

#### Website Changes
- **New Pages**:
  - `/grupper` (groups) - Browse groups
  - `/grupper/[id]` - Group details
  - `/grupper/[id]/mål` - Group goals
- **API Routes**: `/api/groups`, `/api/groups/[id]/join`, `/api/groups/[id]/goals`
- **Components**: `GroupList`, `GroupDetail`, `GoalTracker`

#### API/Database Changes
- **New Models**:
  ```prisma
  model Group {
    id          String   @id @default(cuid())
    name        String   // Group name
    description String?  // Group description
    creatorId   String   // User who created the group
    isPublic    Boolean  @default(false)  // Visible to non-members
    joinPolicy  JoinPolicy @default(INVITE_ONLY)
    maxMembers  Int?    // Maximum members
    
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
    
    // Relations
    creator   User           @relation(fields: [creatorId], references: [id])
    members   GroupMember[]
    goals     GroupGoal[]
    activities GroupActivity[]
    
    @@index([creatorId])
    @@index([isPublic])
  }
  
  enum JoinPolicy {
    OPEN      // Anyone can join
    REQUEST   // Request to join, admin approves
    INVITE_ONLY // Invitation only
  }
  
  model GroupMember {
    id        String   @id @default(cuid())
    groupId   String
    userId    String
    role      GroupRole @default(MEMBER)
    joinedAt  DateTime @default(now())
    
    // Relations
    group  Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
    user   User   @relation(fields: [userId], references: [id])
    
    @@unique([groupId, userId])
    @@index([groupId])
  }
  
  enum GroupRole {
    OWNER
    ADMIN
    MEMBER
  }
  
  model GroupGoal {
    id          String   @id @default(cuid())
    groupId     String
    creatorId   String   // User who created the goal
    title       String   // Goal title
    description String?  // Goal description
    goalType    GoalType
    targetValue Int      // Target number
    startDate   DateTime
    endDate     DateTime?
    status      GoalStatus @default(ACTIVE)
    
    // Current progress
    currentValue Int @default(0)
    
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
    
    // Relations
    group  Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
    creator User @relation(fields: [creatorId], references: [id])
    
    @@index([groupId])
    @@index([status])
  }
  
  enum GoalType {
    TOTAL_ARROWS         // Total arrows shot by group
    AVG_SCORE            // Average score improvement
    PRACTICE_STREAK      // Consecutive practice days
    COMPETITION_WINS     // Competition wins
    PERSONAL_BESTS       // Personal best achievements
    TARGET_ACCURACY       // Accuracy percentage
  }
  
  enum GoalStatus {
    ACTIVE
    COMPLETED
    FAILED
    CANCELLED
  }
  
  model GroupActivity {
    id          String   @id @default(cuid())
    groupId     String
    userId      String
    activityType ActivityType
    title       String?
    description String?
    metadata    Json?    // Additional data (e.g., score, arrows)
    
    createdAt  DateTime @default(now())
    
    // Relations
    group  Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
    user   User   @relation(fields: [userId], references: [id])
    
    @@index([groupId])
    @@index([userId])
  }
  
  enum ActivityType {
    JOINED_GROUP
    LEFT_GROUP
    GOAL_CREATED
    GOAL_COMPLETED
    PRACTICE_ADDED
    COMPETITION_ADDED
    ACHIEVEMENT_UNLOCKED
  }
  ```

- **New API Endpoints**:
  - `GET /api/groups` - List user's groups
  - `GET /api/groups/:id` - Get group details
  - `POST /api/groups` - Create new group
  - `POST /api/groups/:id/join` - Join group (with policy checks)
  - `POST /api/groups/:id/invite` - Invite user to group
  - `POST /api/groups/:id/goals` - Create group goal
  - `GET /api/groups/:id/goals` - List group goals
  - `POST /api/groups/:id/goals/:goalId/progress` - Update goal progress
  - `GET /api/groups/:id/activities` - Get group activity feed

#### User Flow
1. **Create/Join Group**: User creates a group or joins an existing one
2. **Set Goals**: Group members create shared goals (e.g., "Shoot 10,000 arrows this month")
3. **Track Progress**: Each member's practice/competition data contributes to group goals
4. **Monitor Dashboard**: View group progress, individual contributions, activity feed
5. **Celebrate**: Group achieves goals, unlocks group achievements

#### Goal Types
1. **Total Arrows**: Sum of all arrows shot by group members
2. **Average Score**: Group average score improvement over time
3. **Practice Streak**: Consecutive days with at least one practice
4. **Competition Wins**: Count of competition wins by group members
5. **Personal Bests**: Number of personal best achievements
6. **Target Accuracy**: Average accuracy percentage

#### Contribution Models
- **Collective**: Group shares a single goal (e.g., 10,000 arrows total)
- **Individual**: Each member has their own target, group tracks all (e.g., everyone shoots 1,000 arrows)
- **Competitive**: Members compete to achieve goal first or highest score

#### Norwegian Terms
- Gruppe = Group
- Mål = Goal
- Lag = Team
- Bidrag = Contribution
- Fremgang = Progress
- Aktivitet = Activity

### Technical Considerations
- **Real-time Updates**: Group progress needs to update as members log practices
- **Data Aggregation**: Efficient calculation of group totals from individual data
- **Permission System**: Different roles (owner, admin, member) have different capabilities
- **Invitation System**: Email or in-app notifications for group invites

### Priority: MEDIUM
- Good for team/club adoption
- Can leverage existing practice/competition data
- Slightly less complex than leagues but still valuable

---

## Comparison & Recommendation

| Feature | Complexity | User Value | Development Effort | Dependencies | Priority |
|---------|------------|------------|-------------------|--------------|----------|
| Head-to-Head Challenges | Medium | High | 2-3 weeks | Notifications | **HIGH** |
| Virtual Leagues | High | Very High | 4-6 weeks | Leaderboard system, scheduling | MEDIUM-HIGH |
| Shared Goals | Medium | High | 3-4 weeks | Group system, aggregation | MEDIUM |

### Recommended Implementation Order

**Phase 1: Head-to-Head Challenges (2-3 weeks)**
- Quickest to market
- Directly addresses "compete with each other" request
- Builds on existing competition infrastructure
- Tests user interest in social competition

**Phase 2: Shared Goals (3-4 weeks)**
- Add group functionality
- Appeals to clubs and teams
- Less competitive, more collaborative (broader appeal)

**Phase 3: Virtual Leagues (4-6 weeks)**
- Most complex but highest long-term value
- Requires mature infrastructure from Phases 1 & 2
- Can incorporate learnings from earlier phases

### Shared Infrastructure
All three features can share:
- Notification system
- Public profile system
- Competition/practice data models
- User relationship/friend system (if added)
- Leaderboard/ranking components

---

## Technical Architecture Notes

### API Design Patterns
- Use existing `authFetchClient` for authenticated requests
- Implement offline support using `offlineMutation` for all mutations
- Follow existing error handling with `handleApiError`

### Mobile App Integration
- Add new tab in bottom navigation for "Compete" or "Social"
- Or add to existing tabs as sub-screens
- Use existing styling system (colors.ts)
- Follow TDD/DDD workflow from bueboka-context skill

### Website Integration
- New top-level navigation items
- Responsive design for mobile/web
- Integrate with existing auth system

### Database Considerations
- PostgreSQL via Prisma
- Add appropriate indexes for performance
- Consider caching for leaderboards
- Use existing migration system

---

## Next Steps

1. **Validate Ideas**: Get user feedback on which features are most desired
2. **Prioritize**: Confirm implementation order based on business goals
3. **Design**: Create detailed UI/UX mockups for chosen features
4. **Technical Spike**: Investigate any unknown technical challenges
5. **Iterate**: Start with Phase 1 (Head-to-Head Challenges) as MVP

---

## Appendix A: Norwegian Terms Reference

| English | Norwegian | Context |
|---------|-----------|---------|
| Challenge | Utfordring | 1v1 competition |
| League | Liga | Multi-player competition |
| Tournament | Turnering | Organized competition |
| Group | Gruppe | Team of archers |
| Goal | Mål | Shared objective |
| Team | Lag | Group of archers |
| Head-to-Head | En-mot-en | 1v1 competition |
| Leaderboard | Medaljetabell | Rankings |
| Ranking | Ranking | Position in competition |
| Score | Poengsum | Total points |
| Accuracy | Treffsikkerhet | Hit precision |
| Streak | Streak | Consecutive days |
| Achieve | Oppnå | Reach a goal |
| Compete | Konkurrere | Engage in competition |
| Join | Bli med | Participate |
| Invite | Invitere | Request participation |
| Accept | Godta | Agree to join |
| Decline | Avslå | Reject invitation |
| Submit | Send inn | Provide data |

---

## Appendix B: Type Definitions Preview

```typescript
// Challenge Types (Idea 1)
export type ChallengeStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';

export interface Challenge {
  id: string;
  challengerId: string;
  challengedId: string;
  name: string;
  description?: string;
  roundTypeId?: string;
  status: ChallengeStatus;
  startDate?: string;
  endDate?: string;
  challengerScore?: number;
  challengedScore?: number;
  winnerId?: string;
  createdAt: string;
  updatedAt: string;
  challenger?: User;
  challenged?: User;
  winner?: User;
  roundType?: RoundType;
}

// League Types (Idea 2)
export type LeagueType = 'SEASONAL' | 'ONGOING' | 'TOURNAMENT';
export type LeagueStatus = 'DRAFT' | 'OPEN' | 'STARTED' | 'COMPLETED' | 'CANCELLED';

export interface League {
  id: string;
  name: string;
  description?: string;
  organizerId: string;
  type: LeagueType;
  startDate: string;
  endDate?: string;
  maxMembers?: number;
  status: LeagueStatus;
  category?: PracticeCategory;
  createdAt: string;
  updatedAt: string;
  organizer?: User;
  members?: LeagueMember[];
  rounds?: LeagueRound[];
}

// Group Types (Idea 3)
export type JoinPolicy = 'OPEN' | 'REQUEST' | 'INVITE_ONLY';
export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type GoalType = 'TOTAL_ARROWS' | 'AVG_SCORE' | 'PRACTICE_STREAK' | 
  'COMPETITION_WINS' | 'PERSONAL_BESTS' | 'TARGET_ACCURACY';
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Group {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  isPublic: boolean;
  joinPolicy: JoinPolicy;
  maxMembers?: number;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  members?: GroupMember[];
  goals?: GroupGoal[];
}
```
