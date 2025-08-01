import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PodcastDetail.module.css';
import { formatDate } from '../../utils/formatDate';
import GenreTags from '../UI/GenreTags';
import FavoriteButton from '../UI/FavoriteButton';
import { AudioContext } from '../../context/AudioContext';

export default function PodcastDetail({ podcast, genres }) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const season = podcast.seasons[selectedSeasonIndex];
  const navigate = useNavigate();
  const { playEpisode, listenHistory } = useContext(AudioContext);

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Header */}
      <div className={styles.header}>
        <img
          src={podcast.image}
          alt="Podcast Cover"
          className={styles.cover}
        />
        <div>
          <h1 className={styles.title}>{podcast.title}</h1>
          <p className={styles.description}>{podcast.description}</p>

          <div className={styles.metaInfo}>
            <div className={styles.seasonInfo}>
              <div>
                <p>Genres</p>
                <GenreTags genres={genres} />
              </div>

              <div>
                <p>Last Updated:</p>
                <strong>{formatDate(podcast.updated)}</strong>
              </div>

              <div>
                <p>Total Seasons:</p>
                <strong>{podcast.seasons.length} Seasons</strong>
              </div>

              <div>
                <p>Total Episodes:</p>
                <strong>
                  {podcast.seasons.reduce(
                    (acc, s) => acc + s.episodes.length,
                    0
                  )}{' '}
                  Episodes
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Season Details */}
      <div className={styles.seasonDetails}>
        <div className={styles.seasonIntro}>
          <div className={styles.left}>
            <img
              className={styles.seasonCover}
              src={season.image}
            />
            <div>
              <h3>
                Season {selectedSeasonIndex + 1}: {season.title}
              </h3>
              <p>{season.description}</p>
              <p className={styles.releaseInfo}>
                {season.episodes.length} Episodes
              </p>
            </div>
          </div>
          <select
            value={selectedSeasonIndex}
            onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
            className={styles.dropdown}
          >
            {podcast.seasons.map((s, i) => (
              <option
                key={i}
                value={i}
              >
                Season {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.episodeList}>
          {season.episodes.map((ep, index) => {
            const episodeProgress = listenHistory.find(
              (item) => item.episodeId === ep.id
            );

            return (
              <div
                key={index}
                className={styles.episodeCard}
                onClick={() => playEpisode(ep, podcast)}
              >
                {episodeProgress && ep.duration && (
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${Math.min(
                          (episodeProgress.progress / ep.duration) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}
                <img
                  className={styles.episodeCover}
                  src={season.image}
                  alt=""
                />
                <div className={styles.episodeInfo}>
                  <div className={styles.episodeHeader}>
                    <p className={styles.episodeTitle}>
                      Episode {index + 1}: {ep.title}
                    </p>
                    <FavoriteButton
                      episode={ep}
                      show={podcast}
                    />
                  </div>
                  <p className={styles.episodeDesc}>{ep.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
