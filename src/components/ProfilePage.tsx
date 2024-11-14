import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMediatorById } from '../firebase/firestore';
import { Mediator } from '../types';
import img1 from "./../assets/img_1.png";
import img2 from "./../assets/img_2.png";
import img3 from "./../assets/img_3.png";
import img4 from "./../assets/img_4.png";
import img5 from "./../assets/img_5.png";
import img6 from "./../assets/img_6.png";
import img7 from "./../assets/img_7.png";

const ProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const [mediator, setMediator] = useState<Mediator | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMediator = async () => {
            if (id) {
                try {
                    const mediatorData = await getMediatorById(id);
                    if (mediatorData) {
                        setMediator(mediatorData);
                    } else {
                        setError('Profile not found');
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    setError('Failed to load profile');
                }
            }
        };
        fetchMediator();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!mediator) {
        return <div>Loading...</div>;
    }

    const infoBlocks = [
        { title: 'Expertise', items: mediator.expertise, bgColor: 'bg-blue-50', textColor: 'text-blue-700', img: img1 },
        { title: 'Education', items: mediator.education, bgColor: 'bg-green-50', textColor: 'text-green-700', img: img2 },
        { title: 'Licenses', items: mediator.licenses, bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', img: img3 },
        { title: 'Languages', items: mediator.languages, bgColor: 'bg-purple-50', textColor: 'text-purple-700', img: img4 },
        { title: 'Certifications', items: mediator.certifications, bgColor: 'bg-red-50', textColor: 'text-red-700', img: img5 },
        { title: 'Services', items: mediator.services, bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', img: img6 },
        { title: 'Testimonials', items: mediator.testimonials, bgColor: 'bg-green-50', textColor: 'text-green-700', img: img7 },
    ];

    return (
        <div className="p-4  space-y-6">
            <div
                style={{
                    width:"100%",
                    /*backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',*/
                    height: '400px',
                    color: 'white',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: '20px',
                        borderRadius: '8px',
                        display: 'flex',
                        width: "100%",
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {mediator.profileImage &&
                        <img src={mediator.profileImage} height={200} className={"mb-2"} alt={mediator.fullName}/>}
                    <h1 className="text-3xl sm:text-4xl font-bold">{mediator.fullName}</h1>
                    <p className="text-lg sm:text-xl">Location: {mediator.city}, {mediator.state}</p>
                    <p className="text-lg sm:text-xl">Experience: {mediator.experience} years</p>
                    <p className="text-lg sm:text-xl">Email: {mediator.email || "Not Specified"}</p>
                    <p className="text-lg sm:text-xl">Phone: {mediator.phone || "Not Specified"}</p>
                    {/* <p className="text-lg sm:text-xl">Mission Statement: {mediator.missionStatement || "Not Specified"}</p>
                    <p className="text-lg sm:text-xl">Hourly Rate: {mediator.hourlyRate || 'Not specified'}</p>*/}
                </div>
            </div>
            {infoBlocks.map((block, index) => (
                <div
                    key={index}
                    className={`flex flex-col sm:flex-row ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-center space-y-6 sm:space-y-0 sm:space-x-6 bg-white shadow-md rounded-lg overflow-hidden`}
                    style={{ margin: '20px 0', padding: '20px' }}
                >
                    <div className="w-full sm:w-1/2">
                        <img src={block.img} alt={`${block.title} Image`} className="w-full h-auto rounded-lg shadow-lg" />
                    </div>
                    <div className="w-full sm:w-1/2 space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-bold">{block.title}</h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {block.items && block.items.length > 0 ? (
                                block.items.map((item, itemIndex) => (
                                    <span
                                        key={itemIndex}
                                        className={`${block.bgColor} ${block.textColor} px-4 py-2 rounded-full text-sm sm:text-lg`}
                                    >
                                        {item}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No information available</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfilePage;
