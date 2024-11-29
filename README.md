# prog3175-as3

Name: Hyunchul Cho (8752831)

### Github Repo: https://github.com/chc3954/prog3175-as3

### Live URL: https://prog3175-as3.vercel.app

## API Endpoints

### Get All Times of Day

- URL: GET /api/timesOfDay
- Response:

```
["Morning", "Afternoon", "Evening"]
```

### Get All Languages

- URL: GET /api/languages
- Response:

```
["English", "French", "Spanish"]
```

### Greet

- URL: POST /api/greet
- Request body (example):

```
{
  "timeOfDay": "Morning",
  "language": "English",
  "tone": "Casual"
}
```

- Response:

```
{
  "greetingMessage": "Good morning!"
}
```

## To run Cnosole application

1. Go to client folder: `cd client`
2. Build project: `dotnet build`
3. Run application: `dotnet run`
4. Then, you can the texts like below:

```
Available Times of Day:
- Morning
- Afternoon
- Evening

Supported Languages:
- English
- Spanish
- French

Enter a time of day from the list above:
Morning

Enter a language from the list above:
English

Enter a tone (Formal or Casual, default is Formal):
Formal

Greeting: I wish you a pleasant morning.
```
