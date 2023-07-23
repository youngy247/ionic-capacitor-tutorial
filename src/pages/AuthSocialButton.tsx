/* eslint-disable react/prop-types */
import { IconType } from 'react-icons';
import './AuthSocialButtons.css';

interface AuthSocialButtonProps {
    icon: IconType,
    onClick: () => void
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
    icon: Icon,
    onClick
}) => {
    return ( 
        <button
            type="button"
            onClick={onClick}
            className="
                auth-social-button
            "
        >
            <Icon />
        </button>
     );
}
 
export default AuthSocialButton;