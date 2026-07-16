# Community Feedback System

> How to collect, organize, and act on player feedback.

---

## Feedback Channels

### In-Game
- [ ] Feedback button (opens form)
- [ ] Rating prompt (after 5 minutes)
- [ ] Bug report button
- [ ] Suggestion box

### External
- [ ] Discord server
- [ ] Reddit community
- [ ] Twitter/X mentions
- [ ] Email feedback
- [ ] itch.io comments

---

## Feedback Collection Templates

### In-Game Rating
```json
{
  "gameId": "aetheria",
  "timestamp": "2026-07-16T10:00:00Z",
  "sessionLength": 300,
  "rating": 4,
  "comment": "Love the atmosphere!",
  "platform": "Chrome/Windows",
  "version": "0.1.0"
}
```

### Bug Report
```json
{
  "gameId": "aetheria",
  "timestamp": "2026-07-16T10:00:00Z",
  "type": "bug",
  "severity": "high",
  "title": "Game crashes on skyshard collection",
  "description": "When I collect the third skyshard, the game freezes.",
  "stepsToReproduce": [
    "Start game",
    "Collect 3 skyshards",
    "Game crashes"
  ],
  "expectedBehavior": "Game continues",
  "actualBehavior": "Game freezes",
  "platform": "Chrome/Windows",
  "version": "0.1.0"
}
```

### Feature Request
```json
{
  "gameId": "aetheria",
  "timestamp": "2026-07-16T10:00:00Z",
  "type": "feature",
  "title": "Add difficulty settings",
  "description": "Would love to adjust game difficulty.",
  "priority": "medium",
  "votes": 15,
  "platform": "all",
  "version": "0.1.0"
}
```

---

## Feedback Organization

### Categories
1. **Bug** — Something broken
2. **Feature** — Something missing
3. **Improvement** — Something could be better
4. **Praise** — Something working well
5. **Question** — Something confusing

### Priority Levels
1. **Critical** — Game-breaking, fix immediately
2. **High** — Major impact, fix soon
3. **Medium** — Minor impact, fix when possible
4. **Low** — Nice to have, fix if time permits

### Status
1. **New** — Just received
2. **Triaged** — Assessed and prioritized
3. **In Progress** — Being worked on
4. **Resolved** — Fixed
5. **Wontfix** — Not fixing (with reason)

---

## Feedback Analysis

### Quantitative Metrics
- Total feedback count
- Feedback by category
- Feedback by priority
- Average rating over time
- Rating by platform
- Rating by session length

### Qualitative Analysis
- Common themes
- Sentiment analysis
- Pain points
- Feature requests
- Competitive mentions

### Actionable Insights
- Top 3 bugs to fix
- Top 3 features to add
- Top 3 improvements to make
- Player favorite aspects
- Player least favorite aspects

---

## Feedback Response Templates

### Bug Report
```
Thanks for reporting this bug! 

We've confirmed the issue and are working on a fix. 
Expected fix: [Date]

Track progress: [Link to issue]
```

### Feature Request
```
Great suggestion! 

We've added this to our roadmap. 
Current priority: [Priority]
Expected timeline: [Date]

Vote for this feature: [Link]
```

### Positive Feedback
```
Thanks for the kind words! 

We're glad you're enjoying [specific feature].
Your feedback motivates us to keep improving!
```

### Negative Feedback
```
Thanks for the honest feedback.

We hear your concerns about [specific issue].
Here's what we're doing about it: [Action]

We'd love to hear more details: [Contact]
```

---

## Feedback Integration

### Weekly Review
- [ ] Review all new feedback
- [ ] Update priorities
- [ ] Respond to all reports
- [ ] Update status tracker

### Monthly Analysis
- [ ] Analyze trends
- [ ] Update roadmap
- [ ] Share insights with team
- [ ] Plan next iteration

### Quarterly Strategy
- [ ] Review feedback system effectiveness
- [ ] Adjust collection methods
- [ ] Update response templates
- [ ] Train team on feedback handling

---

## Tools

### Free
- Google Forms (surveys)
- Trello (feedback tracking)
- Discord (community)
- GitHub Issues (bug tracking)

### Paid
- UserVoice (feature requests)
- Hotjar (heatmaps, recordings)
- Mixpanel (analytics)
- Intercom (support)

### DIY
- Spreadsheet (basic tracking)
- Discord bot (auto-categorize)
- Webhook (auto-import)
- Script (auto-analyze)

---

## Metrics to Track

### Feedback Volume
- Total feedback per week
- Feedback by channel
- Response rate
- Resolution time

### Quality
- Average rating
- Rating trend
- Sentiment score
- NPS (Net Promoter Score)

### Impact
- Features shipped from feedback
- Bugs fixed from feedback
- Player satisfaction improvement
- Retention improvement
