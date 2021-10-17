let db = {
  users: [
    {
      userId: 'jkhjhjhljhl',
      email: 'jimi@email.com',
      handle: 'Jim-Poiss',
      createdAt: '2021-03-09T17:08:15.053Z',
      imageUrl: 'image/ksldjfjdk/ldk',
      bio: 'Best dog in the world',
      website: 'jimi.ee',
      location: 'Eesti, Parnu'
    }
  ],
  screams: [
    {
      userHandle: 'user1',
      body: 'This is the scream body',
      createdAt: '2021-02-26T15:26:57.533Z',
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: 'user1',
      screamId: 'hhkhkhljh',
      body: 'Nice day!',
      createdAt: '2021-03-09T17:08:15.053Z'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'Kapp',
      read: 'true || false',
      screamId: 'kdkfjskf',
      type: 'like || comment',
      createdAt: '2021-03-09T17:08:15.053Z'
    }
  ]
}
const userDetails = {
  /* Redux data */
  credentials: {
    userId: 'hjhjhkjhhlkjhlkjhk',
    email: 'user1@email.com',
    handle: 'user1',
    createdAt: '2021-03-09T17:08:15.053Z',
    imageUrl: 'image/ksldjfjdk/ldk',
    bio: 'Test user 1',
    website: 'testUser1.com',
    location: 'Mars'
  },
  likes: [
    {
      userHandle: 'user1',
      screamId: 'jfkajsdfja;'
    },
    {
      userHandle: 'user1',
      screamId: 'asdjfkajs;fdja'
    }
  ]
}