import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideosForUser,
  selectUserVideos,
} from "../../reducers/video/videoReducer";
import { useConfig } from "../../customHooks/useConfigHook";
import { AppDispatch } from "../../reducers/store";
import Layout from "../../components/Layout";
import HeroVideoCard from "../../components/HeroVideoCard";
import SideBar from "../../components/SideBar";
import VideoCard from "../../components/VideoCard";

const MyVideos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { configWithJWT } = useConfig();
  const videos = useSelector(selectUserVideos);
  useEffect(() => {
    dispatch(fetchVideosForUser({ configWithJwt: configWithJWT }));
  }, []);
  return (
    <div className="flex w-full gap-2">
      <SideBar />
      <main className="flex-1 lg:ml-64">
        <section className="p-4 mt-3">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {videos?.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyVideos;
