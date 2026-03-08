// =============================================================================
// VIDEO DATA STRUCTURE
// =============================================================================

export interface VideoData {
  /** Unique identifier for the video */
  id: string
  /** YouTube video ID (the part after ?v= in YouTube URLs) */
  youtubeId: string
  /** Optional title for the video */
  title?: string
  /** Optional description for the video */
  description?: string
}

// =============================================================================
// VIDEO DATA BY CATEGORY
// =============================================================================

/**
 * Video data organized by category.
 * Each category can have up to 20 videos (indices 0-19).
 * 
 * To add a video:
 * 1. Find the YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
 * 2. Extract the video ID (the part after ?v=, e.g., 'dQw4w9WgXcQ')
 * 3. Add it to the appropriate category array
 */
export const VIDEO_DATA: Record<string, VideoData[]> = {
  A: [
    { id: 'p0', youtubeId: 'dQw4w9WgXcQ', title: 'Partner Spotlight 1', description: 'An introduction to our partner program and benefits.' },
    { id: 'p1', youtubeId: 'jNQXAC9IVRw', title: 'Partner Spotlight 2', description: 'Stories from our long-time partners and collaborators.' },
    { id: 'p2', youtubeId: 'kJQP7kiw5Fk', title: 'Partner Spotlight 3', description: 'How partners contribute to the community.' },
    { id: 'p3', youtubeId: '9bZkp7q19f0', title: 'Partner Spotlight 4', description: 'Behind the scenes with our partner teams.' },
    { id: 'p4', youtubeId: '60ItHLz5WEA', title: 'Partner Spotlight 5', description: 'A look at recent partner-led events.' },
    { id: 'p5', youtubeId: 'YQHsXMglC9A', title: 'Partner Spotlight 6', description: 'Interview with a community partner.' },
    { id: 'p6', youtubeId: 'e-ORhEE9VVg', title: 'Partner Spotlight 7', description: 'How to become a partner.' },
    { id: 'p7', youtubeId: '3JZ_D3ELwOQ', title: 'Partner Spotlight 8', description: 'Partner success stories and highlights.' },
    { id: 'p8', youtubeId: 'RgKAFK5djSk', title: 'Partner Spotlight 9', description: 'What partners bring to FOROM.' },
    { id: 'p9', youtubeId: 'uelHwf8o7_U', title: 'Partner Spotlight 10', description: 'Partner Q&A and tips.' },
    { id: 'p10', youtubeId: 'fJ9rUzIMcZQ', title: 'Partner Spotlight 11', description: 'Collaboration workflows with partners.' },
    { id: 'p11', youtubeId: 'hT_nvWreIhg', title: 'Partner Spotlight 12', description: 'Partner-focused feature demos.' },
    { id: 'p12', youtubeId: 'ktvTqknDobU', title: 'Partner Spotlight 13', description: 'How partners support creators.' },
    { id: 'p13', youtubeId: 'OPf0YbXqDm0', title: 'Partner Spotlight 14', description: 'Tools partners use to manage programs.' },
    { id: 'p14', youtubeId: 'CevxZvSJLk8', title: 'Partner Spotlight 15', description: 'Stories from partner-hosted workshops.' },
    { id: 'p15', youtubeId: '2Vv-BfVoq4g', title: 'Partner Spotlight 16', description: 'Partner onboarding overview.' },
    { id: 'p16', youtubeId: 'kXYiU_JCYtU', title: 'Partner Spotlight 17', description: 'Measuring partnership impact.' },
    { id: 'p17', youtubeId: 'fLexgOxsZu0', title: 'Partner Spotlight 18', description: 'Partner community initiatives.' },
    { id: 'p18', youtubeId: 'uelHwf8o7_U', title: 'Partner Spotlight 19', description: 'Upcoming partner events.' },
    { id: 'p19', youtubeId: 'hLQl3WQQoQ0', title: 'Partner Spotlight 20', description: 'Closing thoughts from partners.' },
  ],

  B: [
    { id: 'c0', youtubeId: 'dQw4w9WgXcQ', title: 'Culture Clip 1', description: 'A short piece on local culture and events.' },
    { id: 'c1', youtubeId: 'jNQXAC9IVRw', title: 'Culture Clip 2', description: 'Exploring cultural highlights in the community.' },
    { id: 'c2', youtubeId: 'kJQP7kiw5Fk', title: 'Culture Clip 3', description: 'Interviews with cultural organizers.' },
    { id: 'c3', youtubeId: '9bZkp7q19f0', title: 'Culture Clip 4', description: 'Art and performance showcases.' },
    { id: 'c4', youtubeId: '60ItHLz5WEA', title: 'Culture Clip 5', description: 'A documentary-style culture feature.' },
    { id: 'c5', youtubeId: 'YQHsXMglC9A', title: 'Culture Clip 6', description: 'Music and cultural fusion highlights.' },
    { id: 'c6', youtubeId: 'e-ORhEE9VVg', title: 'Culture Clip 7', description: 'Food, festivals and traditions.' },
    { id: 'c7', youtubeId: '3JZ_D3ELwOQ', title: 'Culture Clip 8', description: 'Local history and heritage series.' },
    { id: 'c8', youtubeId: 'RgKAFK5djSk', title: 'Culture Clip 9', description: 'Community cultural workshops.' },
    { id: 'c9', youtubeId: 'uelHwf8o7_U', title: 'Culture Clip 10', description: 'Highlights from cultural talks.' },
    { id: 'c10', youtubeId: 'fJ9rUzIMcZQ', title: 'Culture Clip 11', description: 'Profiles of cultural leaders.' },
    { id: 'c11', youtubeId: 'hT_nvWreIhg', title: 'Culture Clip 12', description: 'Indigenous arts and crafts spotlight.' },
    { id: 'c12', youtubeId: 'ktvTqknDobU', title: 'Culture Clip 13', description: 'Community-driven culture projects.' },
    { id: 'c13', youtubeId: 'OPf0YbXqDm0', title: 'Culture Clip 14', description: 'Street art and public installations.' },
    { id: 'c14', youtubeId: 'CevxZvSJLk8', title: 'Culture Clip 15', description: 'Cultural preservation initiatives.' },
    { id: 'c15', youtubeId: '2Vv-BfVoq4g', title: 'Culture Clip 16', description: 'Live cultural event recordings.' },
    { id: 'c16', youtubeId: 'kXYiU_JCYtU', title: 'Culture Clip 17', description: 'Cultural education series.' },
    { id: 'c17', youtubeId: 'fLexgOxsZu0', title: 'Culture Clip 18', description: 'Cultural exchange programs.' },
    { id: 'c18', youtubeId: 'uelHwf8o7_U', title: 'Culture Clip 19', description: 'Festival highlights and recaps.' },
    { id: 'c19', youtubeId: 'hLQl3WQQoQ0', title: 'Culture Clip 20', description: 'Reflections on community culture.' },
  ],

  C: [
    { id: 'cl0', youtubeId: 'dQw4w9WgXcQ', title: 'Clubs Highlight 1', description: 'Intro to the Clubs program and activities.' },
    { id: 'cl1', youtubeId: 'jNQXAC9IVRw', title: 'Clubs Highlight 2', description: 'Clubs members share experiences.' },
    { id: 'cl2', youtubeId: 'kJQP7kiw5Fk', title: 'Clubs Highlight 3', description: 'Workshops and club meetups.' },
    { id: 'cl3', youtubeId: '9bZkp7q19f0', title: 'Clubs Highlight 4', description: 'How to start a club in the community.' },
    { id: 'cl4', youtubeId: '60ItHLz5WEA', title: 'Clubs Highlight 5', description: 'Club project showcases.' },
    { id: 'cl5', youtubeId: 'YQHsXMglC9A', title: 'Clubs Highlight 6', description: 'Mentorship within clubs.' },
    { id: 'cl6', youtubeId: 'e-ORhEE9VVg', title: 'Clubs Highlight 7', description: 'Clubs collaboration stories.' },
    { id: 'cl7', youtubeId: '3JZ_D3ELwOQ', title: 'Clubs Highlight 8', description: 'Annual club showcases.' },
    { id: 'cl8', youtubeId: 'RgKAFK5djSk', title: 'Clubs Highlight 9', description: 'Competitions and events.' },
    { id: 'cl9', youtubeId: 'uelHwf8o7_U', title: 'Clubs Highlight 10', description: 'Club leadership tips.' },
    { id: 'cl10', youtubeId: 'fJ9rUzIMcZQ', title: 'Clubs Highlight 11', description: 'Club member interviews.' },
    { id: 'cl11', youtubeId: 'hT_nvWreIhg', title: 'Clubs Highlight 12', description: 'Organizing successful meetups.' },
    { id: 'cl12', youtubeId: 'ktvTqknDobU', title: 'Clubs Highlight 13', description: 'Club-driven community projects.' },
    { id: 'cl13', youtubeId: 'OPf0YbXqDm0', title: 'Clubs Highlight 14', description: 'Collaboration across clubs.' },
    { id: 'cl14', youtubeId: 'CevxZvSJLk8', title: 'Clubs Highlight 15', description: 'Club resources and toolkits.' },
    { id: 'cl15', youtubeId: '2Vv-BfVoq4g', title: 'Clubs Highlight 16', description: 'Club funding and support.' },
    { id: 'cl16', youtubeId: 'kXYiU_JCYtU', title: 'Clubs Highlight 17', description: 'Planning long-term club goals.' },
    { id: 'cl17', youtubeId: 'fLexgOxsZu0', title: 'Clubs Highlight 18', description: 'Club success metrics.' },
    { id: 'cl18', youtubeId: 'uelHwf8o7_U', title: 'Clubs Highlight 19', description: 'Club celebration highlights.' },
    { id: 'cl19', youtubeId: 'hLQl3WQQoQ0', title: 'Clubs Highlight 20', description: 'End-of-year club roundups.' },
  ],

  D: [
    { id: 't0', youtubeId: 'dQw4w9WgXcQ', title: 'Trésorie Update 1', description: 'Treasury overview and recent updates.' },
    { id: 't1', youtubeId: 'jNQXAC9IVRw', title: 'Trésorie Update 2', description: 'Budgeting and transparency.' },
    { id: 't2', youtubeId: 'kJQP7kiw5Fk', title: 'Trésorie Update 3', description: 'How the treasury supports projects.' },
    { id: 't3', youtubeId: '9bZkp7q19f0', title: 'Trésorie Update 4', description: 'Funding allocation case studies.' },
    { id: 't4', youtubeId: '60ItHLz5WEA', title: 'Trésorie Update 5', description: 'Managing community funds.' },
    { id: 't5', youtubeId: 'YQHsXMglC9A', title: 'Trésorie Update 6', description: 'Treasury governance explained.' },
    { id: 't6', youtubeId: 'e-ORhEE9VVg', title: 'Trésorie Update 7', description: 'Grant application walkthroughs.' },
    { id: 't7', youtubeId: '3JZ_D3ELwOQ', title: 'Trésorie Update 8', description: 'Reporting and accountability.' },
    { id: 't8', youtubeId: 'RgKAFK5djSk', title: 'Trésorie Update 9', description: 'Treasury FAQ and resources.' },
    { id: 't9', youtubeId: 'uelHwf8o7_U', title: 'Trésorie Update 10', description: 'How to propose a treasury-funded project.' },
    { id: 't10', youtubeId: 'fJ9rUzIMcZQ', title: 'Trésorie Update 11', description: 'Recent treasury-supported initiatives.' },
    { id: 't11', youtubeId: 'hT_nvWreIhg', title: 'Trésorie Update 12', description: 'Community votes and treasury outcomes.' },
    { id: 't12', youtubeId: 'ktvTqknDobU', title: 'Trésorie Update 13', description: 'Best practices for treasury proposals.' },
    { id: 't13', youtubeId: 'OPf0YbXqDm0', title: 'Trésorie Update 14', description: 'Transparency dashboard overview.' },
    { id: 't14', youtubeId: 'CevxZvSJLk8', title: 'Trésorie Update 15', description: 'Treasury timeline and milestones.' },
    { id: 't15', youtubeId: '2Vv-BfVoq4g', title: 'Trésorie Update 16', description: 'Funding distribution models.' },
    { id: 't16', youtubeId: 'kXYiU_JCYtU', title: 'Trésorie Update 17', description: 'How to track treasury spending.' },
    { id: 't17', youtubeId: 'fLexgOxsZu0', title: 'Trésorie Update 18', description: 'Case studies of funded projects.' },
    { id: 't18', youtubeId: 'uelHwf8o7_U', title: 'Trésorie Update 19', description: 'Treasury Q&A with the team.' },
    { id: 't19', youtubeId: 'hLQl3WQQoQ0', title: 'Trésorie Update 20', description: 'Next steps for the treasury.' },
  ],

  E: [
    { id: 'a0', youtubeId: 'dQw4w9WgXcQ', title: 'Atelier Session 1', description: 'Workshop session: getting started.' },
    { id: 'a1', youtubeId: 'jNQXAC9IVRw', title: 'Atelier Session 2', description: 'Hands-on atelier projects and demos.' },
    { id: 'a2', youtubeId: 'kJQP7kiw5Fk', title: 'Atelier Session 3', description: 'Creative process deep dive.' },
    { id: 'a3', youtubeId: '9bZkp7q19f0', title: 'Atelier Session 4', description: 'Materials and techniques.' },
    { id: 'a4', youtubeId: '60ItHLz5WEA', title: 'Atelier Session 5', description: 'Collaborative atelier exercises.' },
    { id: 'a5', youtubeId: 'YQHsXMglC9A', title: 'Atelier Session 6', description: 'Studio setup and best practices.' },
    { id: 'a6', youtubeId: 'e-ORhEE9VVg', title: 'Atelier Session 7', description: 'Project planning for ateliers.' },
    { id: 'a7', youtubeId: '3JZ_D3ELwOQ', title: 'Atelier Session 8', description: 'Showcase of participant work.' },
    { id: 'a8', youtubeId: 'RgKAFK5djSk', title: 'Atelier Session 9', description: 'Techniques for mixed media.' },
    { id: 'a9', youtubeId: 'uelHwf8o7_U', title: 'Atelier Session 10', description: 'Critique and feedback sessions.' },
    { id: 'a10', youtubeId: 'fJ9rUzIMcZQ', title: 'Atelier Session 11', description: 'Scaling atelier projects.' },
    { id: 'a11', youtubeId: 'hT_nvWreIhg', title: 'Atelier Session 12', description: 'Documenting atelier processes.' },
    { id: 'a12', youtubeId: 'ktvTqknDobU', title: 'Atelier Session 13', description: 'Mentorship in atelier settings.' },
    { id: 'a13', youtubeId: 'OPf0YbXqDm0', title: 'Atelier Session 14', description: 'Curating atelier exhibitions.' },
    { id: 'a14', youtubeId: 'CevxZvSJLk8', title: 'Atelier Session 15', description: 'Resource lists for workshops.' },
    { id: 'a15', youtubeId: '2Vv-BfVoq4g', title: 'Atelier Session 16', description: 'Collaborative toolchains.' },
    { id: 'a16', youtubeId: 'kXYiU_JCYtU', title: 'Atelier Session 17', description: 'Workshopping ideas effectively.' },
    { id: 'a17', youtubeId: 'fLexgOxsZu0', title: 'Atelier Session 18', description: 'Atelier guest lectures.' },
    { id: 'a18', youtubeId: 'uelHwf8o7_U', title: 'Atelier Session 19', description: 'Funding and resourcing ateliers.' },
    { id: 'a19', youtubeId: 'hLQl3WQQoQ0', title: 'Atelier Session 20', description: 'Final project showcases.' },
  ],
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the YouTube video ID for a specific category and index.
 * 
 * @param category - The category name (e.g., 'Partenaires', 'Culture')
 * @param index - The video index within the category (0-19)
 * @returns The YouTube video ID or null if not found
 */
export function getVideoId(category: string, index: number): string | null {
  const videos = VIDEO_DATA[category]
  
  if (!videos || index < 0 || index >= videos.length) {
    return null
  }
  
  return videos[index]?.youtubeId ?? null
}

/**
 * Get the full video data for a specific category and index.
 * 
 * @param category - The category name
 * @param index - The video index within the category
 * @returns The full VideoData object or null if not found
 */
export function getVideoData(category: string, index: number): VideoData | null {
  const videos = VIDEO_DATA[category]
  
  if (!videos || index < 0 || index >= videos.length) {
    return null
  }
  
  return videos[index] ?? null
}

/**
 * Get the total number of videos in a category.
 * 
 * @param category - The category name
 * @returns The number of videos in the category
 */
export function getVideoCount(category: string): number {
  return VIDEO_DATA[category]?.length ?? 0
}

/**
 * Check if a category has any videos.
 * 
 * @param category - The category name
 * @returns True if the category has at least one video
 */
export function hasVideos(category: string): boolean {
  return getVideoCount(category) > 0
}
