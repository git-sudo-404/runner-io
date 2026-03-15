-- CREATE TABLE COMMANDS
-- WARNING: Executed during development only

-- for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;


CREATE TABLE Player(
  
  playerID UUID PRIMARY KEY,
  playerName VARCHAR(100) NOT NULL,
  
  playerCity VARCHAR(100),
  playerCountry VARCHAR(100),

  -- Storing your LocationSchema object as a JSON blob
  -- This allows you to store { lat: 1.23, lng: 4.56 } directly
  location JSONB NOT NULL,

  -- Stats (Using NUMERIC for precision with distances/time)
  totalRunDistanceSoFar NUMERIC DEFAULT 0,
  totalRunTimeSoFar NUMERIC DEFAULT 0,
  
  distanceRunToday NUMERIC DEFAULT 0,
  runTimeToday NUMERIC DEFAULT 0,
  
  totalRunsSoFar INTEGER DEFAULT 0 

);


CREATE TABLE RunSession (
    runSessionID UUID PRIMARY KEY,
    playerID UUID NOT NULL REFERENCES Player(playerID) ON DELETE CASCADE,
    
    -- Storing Unix timestamps as BIGINT to match z.number().int()
    startTime BIGINT NOT NULL,
    endTime BIGINT, 
    
    distanceCovered NUMERIC DEFAULT 0,
    durationInSeconds INTEGER DEFAULT 0,
    
    -- Postgres ENUM or Check Constraint for status
    status VARCHAR(20) CHECK (status IN ('active', 'paused', 'aborted', 'completed')) DEFAULT 'active'
);

CREATE TABLE Tick (
    tickID SERIAL PRIMARY KEY, -- Auto-incrementing ID for internal use
    runSessionID UUID NOT NULL REFERENCES RunSession(runSessionID) ON DELETE CASCADE,
    playerID UUID NOT NULL REFERENCES Player(playerID),
    
    location JSONB NOT NULL, -- Matches your LocationSchema object
    timestamp BIGINT NOT NULL,
    accuracy NUMERIC NOT NULL,
    
    -- Optional fields (can be NULL)
    speed NUMERIC,
    altitude NUMERIC
);

-- Indexing for performance: fetching all ticks for a specific run
CREATE INDEX idx_tick_session ON Tick(runSessionID);

CREATE TABLE UserSettings (
    playerID UUID PRIMARY KEY REFERENCES Player(playerID) ON DELETE CASCADE,
    
    preferredDistanceUnit VARCHAR(20) DEFAULT 'kilometers' 
        CHECK (preferredDistanceUnit IN ('kilometers', 'miles')),
        
    isProfilePublic BOOLEAN DEFAULT TRUE,
    allowFriendsStatusNotification BOOLEAN DEFAULT TRUE
);
