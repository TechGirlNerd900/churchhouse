Great! Adding a Twitter-like feed (let's call it the "Daily Scroll" or "Community Pulse") to the home screen is a fantastic idea for increasing engagement and providing more avenues for spiritual content beyond live audio.

This feature requires a different data model and display approach compared to the live audio rooms.

---

# ChurchHouse - Comprehensive Feature List (Continued)

**(Continuing from previous plan...)**

## V. Home Screen Feed ("Daily Scroll" / "Community Pulse")

**Concept:** A chronological feed on the home screen displaying short-form text posts, images, and possibly links to external spiritual content, similar to a Twitter timeline. This allows users to share thoughts, verses, prayers, and resources in a non-real-time, persistent format.

1.  **Post Creation ("Share a Blessing"):**
    * **Text Posts:** Users can compose short text updates (e.g., character limit like Twitter, perhaps 280 or 500 characters).
    * **Image/Video Posts:** Ability to attach a single image or short video clip (e.g., a relevant graphic, a worship snippet).
    * **Verse Snippets:** A quick shortcut to select a verse from the in-app Bible and include it directly in the post.
    * **Hashtags:** Users can add faith-relevant hashtags (e.g., #DailyDevotion, #PrayerRequest, #BibleStudy).
    * **Mentions (@username):** Tag other ChurchHouse users in their posts.
    * **Link Previews:** If a URL is included, display a rich link preview (title, description, image).
    * **Audience Selection:** Choose who can see the post (e.g., "Public," "My Followers," "Specific Fellowship").

2.  **Feed Display ("The Scroll"):**
    * **Chronological Order:** Posts are displayed in reverse chronological order (newest first).
    * **Following Feed:** Primary feed showing posts from users and Fellowships the current user follows.
    * **Discovery Feed:** An "Explore" or "Trending" tab showing popular posts or posts from users/Fellowships outside the user's direct connections, based on interests or engagement.
    * **Post Cards:** Each post displayed as a distinct card containing:
        * User's profile picture and name.
        * Timestamp (e.g., "5m ago," "Yesterday").
        * The post content (text, image, verse snippet, link preview).
        * Engagement metrics (Like count, Comment count, Share count).
    * **Infinite Scrolling:** Efficiently load more posts as the user scrolls down using `FlatList` pagination.
    * **Pull-to-Refresh:** Standard gesture to refresh the feed and fetch new posts.

3.  **Post Interaction:**
    * **Like/ Button:** Users can "like" a post. For ChurchHouse, an "Like" button or a heart-with-cross icon would be more fitting.
    * **Commenting:** Ability to reply to posts, opening a dedicated comment section.
        * Comments are also text-based.
        * Support for mentions and hashtags in comments.
    * **Sharing:**
        * **Repost/Reshare ("Re-Bless"):** Similar to Twitter's retweet, allow users to re-share a post to their own feed.
        * **Share Externally:** Share post content to other apps (e.g., messaging, email).
    * **Report Post:** Option to report inappropriate or guideline-violating content.
    * **Delete Post:** Users can delete their own posts.

4.  **Notifications related to Feed Posts:**
    * When someone likes your post.
    * When someone comments on your post.
    * When someone mentions you in a post or comment.
    * When someone shares your post.

## VI. Technical Considerations for the Feed

1.  **Firebase Data Structure (Cloud Firestore recommended for Feed Posts):**
    * **`posts` Collection:**
        * Each document represents a single post.
        * Fields: `postId` (auto-generated ID), `userId` (ID of the creator), `userName`, `userProfilePic`, `timestamp` (Firestore `Timestamp`), `text` (string), `imageUrl` (string, optional), `videoUrl` (string, optional), `bibleVerse` (object: `{ reference: string, text: string }`, optional), `links` (array of objects: `{ url: string, title: string, description: string, image: string }`, optional), `hashtags` (array of strings), `mentions` (array of UIDs), `audience` (string: 'public', 'followers', 'fellowship_id'), `likeCount` (number), `commentCount` (number), `shareCount` (number).
        * **Indexing:** Crucial for performance. Firestore automatically indexes single fields, but you'll need **composite indexes** for queries involving `orderBy` and `where` clauses (e.g., `where('userId', '==', 'X').orderBy('timestamp', 'desc')`).
    * **`likes` Subcollection/Collection:**
        * **Option 1 (Subcollection on Post):** `posts/{postId}/likes/{userId}` -> simple boolean true. Good for knowing who liked what.
        * **Option 2 (Top-level Collection):** `likes/{likeId}` -> `{ postId, userId, timestamp }`. Better for querying all likes by a user.
    * **`comments` Subcollection/Collection:**
        * **Option 1 (Subcollection on Post):** `posts/{postId}/comments/{commentId}` -> `{ userId, userName, text, timestamp }`. Simpler for displaying comments on a post.
        * **Option 2 (Top-level Collection):** `comments/{commentId}` -> `{ postId, userId, userName, text, timestamp }`. More flexible for querying all comments made by a user.
    * **Feed Construction (Fan-out strategy):**
        * **"Pull" (Simpler for Prototype):** When a user loads their feed, query `posts` collection for posts from `userId`s they follow. This can be inefficient at scale.
        * **"Push" (More Scalable, but uses more writes):** When a user creates a post, a **Firebase Cloud Function** (triggered by the new post) automatically writes that post's ID (or a snippet of the data) to the "inbox" feed of all the followers of that user. This makes reading feeds extremely fast.
            * **`userFeeds/{followerUserId}/feedItems` subcollection/collection:** Each document here would reference a `postId` and its timestamp.
            * **Recommendation for prototype:** Start with the "pull" method, as it's simpler and avoids Cloud Functions immediately. If performance becomes an issue or you exceed free tier write limits, consider implementing a simplified "push" (fan-out) strategy via Cloud Functions.

2.  **React Native `FlatList` Implementation:**
    * Use `FlatList` for efficient rendering of posts, handling large datasets.
    * Implement `onEndReached` for pagination (loading older posts as user scrolls down).
    * Implement `onRefresh` (for pull-to-refresh) to fetch newer posts.
    * `keyExtractor` for unique post keys (e.g., `item.postId`).
    * Optimize `renderItem` component to be performant (e.g., using `React.memo` for individual `PostCard` components).

3.  **Firebase Query Optimization:**
    * **Pagination:** Use `orderBy('timestamp', 'desc').limit(20)` for initial load, then `startAfter(lastVisiblePostTimestamp).limit(20)` for subsequent loads.
    * **Indexing:** Ensure correct Firestore indexes are in place for all your queries (Firebase Console will prompt you if a query requires an index not yet defined).
    * **Denormalization:** Duplicate relevant user info (name, profile pic) directly into the post document to avoid extra reads for each post in the feed. This is a common NoSQL best practice.
    * **Listener Types:** For the main feed, a `get()` followed by pagination might be sufficient, or a real-time `onSnapshot()` with `limit` for active updates at the top of the feed (but be mindful of read counts).

This "Daily Scroll" feature will add a significant layer of asynchronous communication and content sharing to ChurchHouse, complementing the real-time audio Chapels and providing a more complete social experience.