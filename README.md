### Project Description
> :exclamation: **PROJECT COMPLETED FOR THE MIDUDEV HACKATHON IN COLLABORATION WITH VERCEL**
> ### Deployed at: https://energym-drab.vercel.app/



![energym1](https://github.com/user-attachments/assets/fe7071fb-d210-449e-ab8d-b582b0bd49d6)

**EnerGYM** is a web application designed to enhance your workout experience through music. Using artificial intelligence, **EnerGYM** analyzes your Spotify playlists and determines how optimal they are for working out based on the energy levels of each song. Simply enter the URL of your Spotify playlist and discover the energy of your music, helping you find the perfect rhythms to keep you moving.

![energym2](https://github.com/user-attachments/assets/d98c5bce-a0fa-4571-84fe-8638a5969c01)

## Features

- **Spotify Playlist Analysis**: Enter a URL of your Spotify playlist and get an analysis of each song.
- **Energy Score**: Each song receives an energy score indicating how motivating it is for working out.
- **Average Energy Score**: Displays an average energy score for the entire playlist.
- **User-Friendly Interface**: Intuitive and easy-to-use interface with an attractive and responsive design.
- **Mobile Optimization**: The app is optimized for use on mobile devices and tablets.

## Technologies Used

- **Next.js**: React framework for web application development.
- **Tailwind CSS**: CSS framework for fast and efficient design.
- **Spotify API**: To fetch details and tracks from playlists.
- **Vercel AI SDK**: To use **Llama 3.1** through the free tier of **Groq** for song analysis and energy score generation.

> :warning: **Important Notice:** Using the free tier of Groq for song analysis and energy score generation has usage limits.


### Setup Instructions

## Installation and Configuration

1. **Clone the repository**:
    ```bash
    git clone https://github.com/MonforteGG/energym.git
    ```
2. **Navigate to the project directory**:
    ```bash
    cd energym
    ```
3. **Install dependencies**:
    ```bash
    npm install
    ```
4. **Set up environment variables**: Create a `.env.local` file in the root of the project and add your Spotify and OpenAI credentials.
    ```env
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    GROQ_API_KEY=your_groq_api_key
    ```
5. **Start the development server**:
    ```bash
    npm run dev
    ```
6. **Access the application**: Open your browser and navigate to `http://localhost:3000`.
