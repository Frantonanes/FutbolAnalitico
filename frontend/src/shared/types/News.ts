export type Writer = {
  _id: string
  name: string
  slug: string
  image?: string
  role?: string
  bio?: string
  twitter?: string
  instagram?: string
}

export type NewsSection =
  | {
      type: 'text'
      content: string
    }
  | {
      type: 'image-left'
      content: string
      image: string
      mediaId?: string
    }
  | {
      type: 'image-right'
      content: string
      image: string
      mediaId?: string
    }
  | {
      type: 'image-full'
      image: string
      mediaId?: string
    }

export type News = {
  _id?: string
  id?: string
  slug: string
  title: string
  subtitle: string
  category: string
  categoryId?: string
  image: string
  featuredMediaId?: string
  mediaIds?: string[]
  sections: NewsSection[]
  competition?: string
  teams?: string[]
  hashtags: string[]
  authorId?: string | Writer | null
  createdAt?: string
}