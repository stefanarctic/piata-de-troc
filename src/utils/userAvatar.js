import { isValidImageUrl } from './listingImage'

const PLACEHOLDER = '/placeholder-user.svg'

export function getUserAvatar(user) {
  const avatar = user?.authorAvatar || user?.avatar
  return isValidImageUrl(avatar) ? avatar : PLACEHOLDER
}

export function userAvatarProps(user) {
  const src = getUserAvatar(user)
  return {
    src,
    onError: (e) => {
      if (e.currentTarget.src !== PLACEHOLDER) {
        e.currentTarget.src = PLACEHOLDER
      }
    },
  }
}
