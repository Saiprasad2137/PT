import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ url }) => {
    const navigate = useNavigate();

    const onClick = () => {
        if (url) {
            navigate(url);
        } else {
            navigate(-1);
        }
    };

    return (
        <button className='btn btn-back' onClick={onClick} style={{ marginBottom: '20px' }}>
            <FaArrowLeft /> Back
        </button>
    );
};

export default BackButton;
