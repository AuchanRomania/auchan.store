import React, { useState } from 'react';
import UserDataPixel from './UserDataPixel';
import PageViewPixel from './PageViewPixel';

// Define the interface for props
interface UserPageHandlerProps {
  title: string;
}



const UserPageHandler: React.FC<UserPageHandlerProps> = ({ title }) => {
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  return (
    <>
      {/* Render UserDataPixel */}
      <UserDataPixel onUserDataLoaded={() => setIsUserDataLoaded(true)}/>

      {/* Conditionally render PageViewPixel after UserDataPixel is loaded */}
      {isUserDataLoaded && <PageViewPixel title={title} />}
    </>
  );
};

export default UserPageHandler;
