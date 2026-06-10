import { useUser } from '../context/UserContext'
import { userAvatarProps } from '../utils/userAvatar'

export default function ProfileEditPage() {
  const { user } = useUser()

  return (
    <div className="profile-edit">
      <h1>Editeaza profilul</h1>

      <div className="profile-edit-card">
        <div className="profile-edit-avatar">
          <img {...userAvatarProps({ avatar: user?.avatar })} alt="" />
        </div>

        <dl className="profile-edit-fields">
          <div>
            <dt>Nume utilizator</dt>
            <dd>{user?.login}</dd>
          </div>
          <div>
            <dt>Nume afisat</dt>
            <dd>{user?.displayName}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email || '—'}</dd>
          </div>
          <div>
            <dt>Membru din</dt>
            <dd>{user?.memberSince || '—'}</dd>
          </div>
        </dl>

        <p className="profile-edit-note">
          Pentru a modifica parola, avatarul sau alte setari avansate, foloseste panoul WordPress.
        </p>
        <a
          href="https://piatadetroc.ro/my-dashboard/?directory_action=profile"
          className="btn btn-primary"
          target="_blank"
          rel="noreferrer"
        >
          Deschide editorul WordPress
        </a>
      </div>
    </div>
  )
}
