// Comprehensive word database for Word Adventure Kids Dashboard
// Organized by categories with difficulty levels and rich metadata

export const wordsDatabase = [
  // FOOD CATEGORY
  { id: 1, word: 'Apple', image: '🍎', known: false, difficulty: 'easy', category: 'food', pronunciation: '/ˈæpəl/', definition: 'A round fruit with red or green skin', example: 'I eat an apple for breakfast', funFact: 'Apples float because they are 25% air!' },
  { id: 2, word: 'Banana', image: '🍌', known: false, difficulty: 'easy', category: 'food', pronunciation: '/bəˈnænə/', definition: 'A long yellow fruit', example: 'Monkeys love to eat bananas', funFact: 'Bananas are berries, but strawberries are not!' },
  { id: 3, word: 'Orange', image: '🍊', known: false, difficulty: 'easy', category: 'food', pronunciation: '/ˈɔːrɪndʒ/', definition: 'A round citrus fruit', example: 'Orange juice is delicious', funFact: 'Oranges were originally green!' },
  { id: 4, word: 'Strawberry', image: '🍓', known: false, difficulty: 'easy', category: 'food', pronunciation: '/ˈstrɔːberi/', definition: 'A small red fruit with seeds on the outside', example: 'Strawberries taste sweet', funFact: 'A strawberry has about 200 seeds!' },
  { id: 5, word: 'Grapes', image: '🍇', known: false, difficulty: 'easy', category: 'food', pronunciation: '/ɡreɪps/', definition: 'Small round fruits that grow in bunches', example: 'Purple grapes are my favorite', funFact: 'Grapes can be made into raisins!' },
  { id: 6, word: 'Watermelon', image: '🍉', known: false, difficulty: 'medium', category: 'food', pronunciation: '/ˈwɔːtərmelən/', definition: 'A large green fruit with red inside', example: 'Watermelon is perfect for summer', funFact: 'Watermelons are 92% water!' },
  { id: 7, word: 'Pineapple', image: '🍍', known: false, difficulty: 'medium', category: 'food', pronunciation: '/ˈpaɪnæpəl/', definition: 'A tropical fruit with spiky skin', example: 'Pineapple pizza is controversial', funFact: 'It takes 2 years to grow a pineapple!' },
  { id: 8, word: 'Carrot', image: '🥕', known: false, difficulty: 'easy', category: 'food', pronunciation: '/ˈkærət/', definition: 'An orange vegetable that grows underground', example: 'Carrots help you see better', funFact: 'Carrots used to be purple!' },
  { id: 9, word: 'Broccoli', image: '🥦', known: false, difficulty: 'medium', category: 'food', pronunciation: '/ˈbrɑːkəli/', definition: 'A green vegetable that looks like a tree', example: 'Broccoli is very healthy', funFact: 'Broccoli has more vitamin C than oranges!' },
  { id: 10, word: 'Bread', image: '🍞', known: false, difficulty: 'easy', category: 'food', pronunciation: '/bred/', definition: 'Food made from flour and water', example: 'I like bread with butter', funFact: 'Bread has been eaten for 14,000 years!' },
  { id: 11, word: 'Cheese', image: '🧀', known: false, difficulty: 'easy', category: 'food', pronunciation: '/tʃiːz/', definition: 'A dairy product made from milk', example: 'Cheese makes pizza taste great', funFact: 'There are over 1,800 types of cheese!' },
  { id: 12, word: 'Ice cream', image: '🍦', known: true, difficulty: 'easy', category: 'food', pronunciation: '/aɪs kriːm/', definition: 'A cold, sweet frozen dessert', example: 'Ice cream is my favorite treat', funFact: 'Vanilla is the most popular ice cream flavor!' },
  { id: 13, word: 'Pizza', image: '🍕', known: false, difficulty: 'easy', category: 'food', pronunciation: '/ˈpiːtsə/', definition: 'A round flatbread with toppings', example: 'Pizza is great for parties', funFact: 'Americans eat 3 billion pizzas per year!' },
  { id: 14, word: 'Hamburger', image: '🍔', known: false, difficulty: 'medium', category: 'food', pronunciation: '/ˈhæmbɜːrɡər/', definition: 'A sandwich with meat in a bun', example: 'I ordered a hamburger for lunch', funFact: 'The hamburger was invented in America!' },
  { id: 15, word: 'Cookie', image: '🍪', known: false, difficulty: 'easy', category: 'food', pronunciation: '/ˈkʊki/', definition: 'A small sweet baked treat', example: 'Grandma bakes the best cookies', funFact: 'The chocolate chip cookie was invented by accident!' },

  // ANIMALS CATEGORY
  { id: 16, word: 'Cat', image: '🐱', known: true, difficulty: 'easy', category: 'animals', pronunciation: '/kæt/', definition: 'A small furry pet that says meow', example: 'My cat loves to play with yarn', funFact: 'Cats sleep 12-16 hours per day!' },
  { id: 17, word: 'Dog', image: '🐶', known: true, difficulty: 'easy', category: 'animals', pronunciation: '/dɔːɡ/', definition: 'A loyal pet that barks and wags its tail', example: 'Dogs are man\'s best friend', funFact: 'Dogs can learn over 150 words!' },
  { id: 18, word: 'Elephant', image: '🐘', known: false, difficulty: 'medium', category: 'animals', pronunciation: '/ˈeləfənt/', definition: 'A huge gray animal with a long trunk', example: 'Elephants never forget', funFact: 'Elephants can\'t jump!' },
  { id: 19, word: 'Lion', image: '🦁', known: false, difficulty: 'easy', category: 'animals', pronunciation: '/ˈlaɪən/', definition: 'The king of the jungle with a big mane', example: 'Lions roar very loudly', funFact: 'A lion\'s roar can be heard 5 miles away!' },
  { id: 20, word: 'Tiger', image: '🐅', known: false, difficulty: 'medium', category: 'animals', pronunciation: '/ˈtaɪɡər/', definition: 'A big orange cat with black stripes', example: 'Tigers are excellent swimmers', funFact: 'No two tigers have the same stripes!' },
  { id: 21, word: 'Bear', image: '🐻', known: false, difficulty: 'easy', category: 'animals', pronunciation: '/ber/', definition: 'A large furry animal that hibernates', example: 'Bears love to eat honey', funFact: 'Bears can run 30 miles per hour!' },
  { id: 22, word: 'Monkey', image: '🐵', known: false, difficulty: 'easy', category: 'animals', pronunciation: '/ˈmʌŋki/', definition: 'A playful animal that swings from trees', example: 'Monkeys eat bananas', funFact: 'Some monkeys can use tools!' },
  { id: 23, word: 'Giraffe', image: '🦒', known: false, difficulty: 'medium', category: 'animals', pronunciation: '/dʒəˈræf/', definition: 'The tallest animal with a very long neck', example: 'Giraffes eat leaves from tall trees', funFact: 'A giraffe\'s tongue is 20 inches long!' },
  { id: 24, word: 'Zebra', image: '🦓', known: false, difficulty: 'medium', category: 'animals', pronunciation: '/ˈziːbrə/', definition: 'A horse-like animal with black and white stripes', example: 'Zebras live in Africa', funFact: 'Each zebra has a unique stripe pattern!' },
  { id: 25, word: 'Penguin', image: '🐧', known: false, difficulty: 'medium', category: 'animals', pronunciation: '/ˈpeŋɡwɪn/', definition: 'A black and white bird that can\'t fly but swims well', example: 'Penguins slide on their bellies', funFact: 'Penguins can hold their breath for 20 minutes!' },
  { id: 26, word: 'Fish', image: '🐟', known: false, difficulty: 'easy', category: 'animals', pronunciation: '/fɪʃ/', definition: 'An animal that lives in water and has fins', example: 'Fish breathe through gills', funFact: 'Some fish can live for over 100 years!' },
  { id: 27, word: 'Bird', image: '🐦', known: false, difficulty: 'easy', category: 'animals', pronunciation: '/bɜːrd/', definition: 'An animal with wings and feathers that can fly', example: 'Birds build nests in trees', funFact: 'The smallest bird is the bee hummingbird!' },
  { id: 28, word: 'Butterfly', image: '🦋', known: false, difficulty: 'medium', category: 'animals', pronunciation: '/ˈbʌtərflaɪ/', definition: 'A colorful insect with beautiful wings', example: 'Butterflies start as caterpillars', funFact: 'Butterflies taste with their feet!' },
  { id: 29, word: 'Bee', image: '🐝', known: false, difficulty: 'easy', category: 'animals', pronunciation: '/biː/', definition: 'A buzzing insect that makes honey', example: 'Bees help flowers grow', funFact: 'Bees dance to communicate!' },
  { id: 30, word: 'Rabbit', image: '🐰', known: false, difficulty: 'easy', category: 'animals', pronunciation: '/ˈræbɪt/', definition: 'A fluffy animal with long ears that hops', example: 'Rabbits love to eat carrots', funFact: 'Rabbits can see behind them!' },

  // OBJECTS CATEGORY
  { id: 31, word: 'House', image: '🏠', known: true, difficulty: 'easy', category: 'objects', pronunciation: '/haʊs/', definition: 'A building where people live', example: 'My house has a red door', funFact: 'The oldest house is 9,000 years old!' },
  { id: 32, word: 'Car', image: '🚗', known: false, difficulty: 'easy', category: 'objects', pronunciation: '/kɑːr/', definition: 'A vehicle with four wheels', example: 'We drive to school in our car', funFact: 'The first car had three wheels!' },
  { id: 33, word: 'Airplane', image: '✈️', known: false, difficulty: 'medium', category: 'objects', pronunciation: '/ˈerpleɪn/', definition: 'A flying machine with wings', example: 'Airplanes fly high in the sky', funFact: 'The Wright brothers flew for 12 seconds!' },
  { id: 34, word: 'Bicycle', image: '🚲', known: false, difficulty: 'medium', category: 'objects', pronunciation: '/ˈbaɪsɪkəl/', definition: 'A two-wheeled vehicle you pedal', example: 'I ride my bicycle to the park', funFact: 'Bicycles are the most efficient form of transport!' },
  { id: 35, word: 'Ball', image: '⚽', known: false, difficulty: 'easy', category: 'objects', pronunciation: '/bɔːl/', definition: 'A round object used in games', example: 'Let\'s play catch with the ball', funFact: 'The oldest ball is 4,500 years old!' },
  { id: 36, word: 'Book', image: '📚', known: false, difficulty: 'easy', category: 'objects', pronunciation: '/bʊk/', definition: 'Pages with words and pictures to read', example: 'I love reading adventure books', funFact: 'The longest book has 4 million words!' },
  { id: 37, word: 'Phone', image: '📱', known: false, difficulty: 'easy', category: 'objects', pronunciation: '/foʊn/', definition: 'A device used to talk to people far away', example: 'Mom calls me on the phone', funFact: 'The first mobile phone weighed 2 pounds!' },
  { id: 38, word: 'Computer', image: '💻', known: false, difficulty: 'medium', category: 'objects', pronunciation: '/kəmˈpjuːtər/', definition: 'An electronic device for work and games', example: 'I play games on the computer', funFact: 'The first computer filled an entire room!' },
  { id: 39, word: 'Television', image: '📺', known: false, difficulty: 'medium', category: 'objects', pronunciation: '/ˈteləvɪʒən/', definition: 'A screen that shows movies and shows', example: 'We watch cartoons on television', funFact: 'The first TV show was about a puppet!' },
  { id: 40, word: 'Chair', image: '🪑', known: false, difficulty: 'easy', category: 'objects', pronunciation: '/tʃer/', definition: 'Furniture you sit on', example: 'I sit on my chair to eat', funFact: 'The oldest chair is 5,000 years old!' },
  { id: 41, word: 'Table', image: '🪑', known: false, difficulty: 'easy', category: 'objects', pronunciation: '/ˈteɪbəl/', definition: 'Flat furniture you put things on', example: 'We eat dinner at the table', funFact: 'Tables were first used by ancient Egyptians!' },
  { id: 42, word: 'Bed', image: '🛏️', known: false, difficulty: 'easy', category: 'objects', pronunciation: '/bed/', definition: 'Furniture you sleep on', example: 'I sleep in my cozy bed', funFact: 'We spend one-third of our lives in bed!' },
  { id: 43, word: 'Clock', image: '🕐', known: false, difficulty: 'medium', category: 'objects', pronunciation: '/klɑːk/', definition: 'A device that shows the time', example: 'The clock shows it\'s time for lunch', funFact: 'The first clocks didn\'t have hands!' },
  { id: 44, word: 'Mirror', image: '🪞', known: false, difficulty: 'medium', category: 'objects', pronunciation: '/ˈmɪrər/', definition: 'Glass that shows your reflection', example: 'I brush my teeth in front of the mirror', funFact: 'Mirrors were once made of polished metal!' },
  { id: 45, word: 'Door', image: '🚪', known: false, difficulty: 'easy', category: 'objects', pronunciation: '/dɔːr/', definition: 'An opening you walk through', example: 'Please close the door behind you', funFact: 'The oldest door is 5,000 years old!' },

  // NATURE CATEGORY
  { id: 46, word: 'Tree', image: '🌳', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/triː/', definition: 'A tall plant with branches and leaves', example: 'Birds build nests in trees', funFact: 'The oldest tree is over 4,800 years old!' },
  { id: 47, word: 'Flower', image: '🌸', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/ˈflaʊər/', definition: 'The colorful part of a plant', example: 'Flowers smell beautiful', funFact: 'Some flowers can live for 100 years!' },
  { id: 48, word: 'Sun', image: '☀️', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/sʌn/', definition: 'The bright star that gives us light', example: 'The sun makes plants grow', funFact: 'The sun is 93 million miles away!' },
  { id: 49, word: 'Moon', image: '🌙', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/muːn/', definition: 'The bright object we see at night', example: 'The moon changes shape each night', funFact: 'The moon is moving away from Earth!' },
  { id: 50, word: 'Star', image: '⭐', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/stɑːr/', definition: 'Tiny lights we see in the night sky', example: 'Stars twinkle in the darkness', funFact: 'There are more stars than grains of sand!' },
  { id: 51, word: 'Cloud', image: '☁️', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/klaʊd/', definition: 'White fluffy things in the sky', example: 'Clouds bring rain', funFact: 'Clouds are made of tiny water drops!' },
  { id: 52, word: 'Rain', image: '🌧️', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/reɪn/', definition: 'Water that falls from clouds', example: 'Plants need rain to grow', funFact: 'A raindrop falls at 20 miles per hour!' },
  { id: 53, word: 'Snow', image: '❄️', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/snoʊ/', definition: 'White flakes that fall when it\'s cold', example: 'We build snowmen with snow', funFact: 'No two snowflakes are exactly alike!' },
  { id: 54, word: 'Ocean', image: '🌊', known: false, difficulty: 'medium', category: 'nature', pronunciation: '/ˈoʊʃən/', definition: 'A huge body of salt water', example: 'Whales live in the ocean', funFact: 'We\'ve explored less than 5% of the ocean!' },
  { id: 55, word: 'Mountain', image: '⛰️', known: false, difficulty: 'medium', category: 'nature', pronunciation: '/ˈmaʊntən/', definition: 'A very tall hill made of rock', example: 'Snow covers the mountain top', funFact: 'Mount Everest grows 4mm taller each year!' },
  { id: 56, word: 'River', image: '🏞️', known: false, difficulty: 'medium', category: 'nature', pronunciation: '/ˈrɪvər/', definition: 'Moving water that flows to the sea', example: 'Fish swim in the river', funFact: 'The longest river is the Nile!' },
  { id: 57, word: 'Forest', image: '🌲', known: false, difficulty: 'medium', category: 'nature', pronunciation: '/ˈfɔːrəst/', definition: 'A place with many trees', example: 'Many animals live in the forest', funFact: 'Forests produce the oxygen we breathe!' },
  { id: 58, word: 'Beach', image: '🏖️', known: false, difficulty: 'medium', category: 'nature', pronunciation: '/biːtʃ/', definition: 'Sandy area next to the ocean', example: 'We build sandcastles at the beach', funFact: 'Sand is made from tiny pieces of rock!' },
  { id: 59, word: 'Rainbow', image: '🌈', known: false, difficulty: 'medium', category: 'nature', pronunciation: '/ˈreɪnboʊ/', definition: 'Colorful arc in the sky after rain', example: 'Rainbows have seven colors', funFact: 'You can never reach the end of a rainbow!' },
  { id: 60, word: 'Wind', image: '💨', known: false, difficulty: 'easy', category: 'nature', pronunciation: '/wɪnd/', definition: 'Moving air you can feel', example: 'Wind makes the leaves dance', funFact: 'Wind can travel over 200 miles per hour!' },

  // BODY PARTS CATEGORY
  { id: 61, word: 'Eye', image: '👁️', known: false, difficulty: 'easy', category: 'body', pronunciation: '/aɪ/', definition: 'The part of your body you see with', example: 'I have two brown eyes', funFact: 'Your eyes blink 15-20 times per minute!' },
  { id: 62, word: 'Nose', image: '👃', known: false, difficulty: 'easy', category: 'body', pronunciation: '/noʊz/', definition: 'The part of your face you smell with', example: 'I smell cookies with my nose', funFact: 'Your nose can remember 50,000 scents!' },
  { id: 63, word: 'Mouth', image: '👄', known: false, difficulty: 'easy', category: 'body', pronunciation: '/maʊθ/', definition: 'The part of your face you eat and talk with', example: 'I brush my teeth in my mouth', funFact: 'Your mouth makes 1 liter of saliva daily!' },
  { id: 64, word: 'Ear', image: '👂', known: false, difficulty: 'easy', category: 'body', pronunciation: '/ɪr/', definition: 'The part of your body you hear with', example: 'I listen to music with my ears', funFact: 'Your ears help you balance!' },
  { id: 65, word: 'Hand', image: '✋', known: false, difficulty: 'easy', category: 'body', pronunciation: '/hænd/', definition: 'The part at the end of your arm', example: 'I wave hello with my hand', funFact: 'Your hand has 27 bones!' },
  { id: 66, word: 'Foot', image: '🦶', known: false, difficulty: 'easy', category: 'body', pronunciation: '/fʊt/', definition: 'The part at the end of your leg', example: 'I walk and run with my feet', funFact: 'Your foot has 26 bones!' },
  { id: 67, word: 'Head', image: '🗣️', known: false, difficulty: 'easy', category: 'body', pronunciation: '/hed/', definition: 'The top part of your body with your brain', example: 'I wear a hat on my head', funFact: 'Your head has 22 bones!' },
  { id: 68, word: 'Hair', image: '💇', known: false, difficulty: 'easy', category: 'body', pronunciation: '/her/', definition: 'The strands that grow on your head', example: 'I brush my hair every morning', funFact: 'Hair grows about 6 inches per year!' },
  { id: 69, word: 'Teeth', image: '🦷', known: false, difficulty: 'easy', category: 'body', pronunciation: '/tiːθ/', definition: 'The white things in your mouth for chewing', example: 'I brush my teeth twice a day', funFact: 'Tooth enamel is the hardest substance in your body!' },
  { id: 70, word: 'Arm', image: '💪', known: false, difficulty: 'easy', category: 'body', pronunciation: '/ɑːrm/', definition: 'The long part of your body from shoulder to hand', example: 'I carry books with my arms', funFact: 'Your arm has three main bones!' },
  { id: 71, word: 'Leg', image: '🦵', known: false, difficulty: 'easy', category: 'body', pronunciation: '/leɡ/', definition: 'The long part of your body you walk with', example: 'I kick the ball with my leg', funFact: 'Your leg has the longest bone in your body!' },
  { id: 72, word: 'Finger', image: '👆', known: false, difficulty: 'easy', category: 'body', pronunciation: '/ˈfɪŋɡər/', definition: 'The five parts at the end of your hand', example: 'I point with my finger', funFact: 'Your fingers have no muscles!' },
  { id: 73, word: 'Toe', image: '🦶', known: false, difficulty: 'easy', category: 'body', pronunciation: '/toʊ/', definition: 'The five parts at the end of your foot', example: 'I wiggle my toes in the sand', funFact: 'Your big toe has two bones!' },
  { id: 74, word: 'Knee', image: '🦵', known: false, difficulty: 'medium', category: 'body', pronunciation: '/niː/', definition: 'The joint in the middle of your leg', example: 'I bend my knee to sit down', funFact: 'Your kneecap is your body\'s largest sesamoid bone!' },
  { id: 75, word: 'Elbow', image: '💪', known: false, difficulty: 'medium', category: 'body', pronunciation: '/ˈelboʊ/', definition: 'The joint in the middle of your arm', example: 'I bend my elbow to wave', funFact: 'Your funny bone is actually a nerve!' },

  // COLORS CATEGORY
  { id: 76, word: 'Red', image: '🔴', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/red/', definition: 'The color of fire and strawberries', example: 'Stop signs are red', funFact: 'Red is the first color babies can see!' },
  { id: 77, word: 'Blue', image: '🔵', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/bluː/', definition: 'The color of the sky and ocean', example: 'The sky is blue on sunny days', funFact: 'Blue is the world\'s favorite color!' },
  { id: 78, word: 'Yellow', image: '🟡', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/ˈjeloʊ/', definition: 'The color of the sun and bananas', example: 'Sunflowers are bright yellow', funFact: 'Yellow makes you feel happy!' },
  { id: 79, word: 'Green', image: '🟢', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/ɡriːn/', definition: 'The color of grass and leaves', example: 'Trees have green leaves', funFact: 'Green is the easiest color for eyes to see!' },
  { id: 80, word: 'Orange', image: '🟠', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/ˈɔːrɪndʒ/', definition: 'The color of pumpkins and carrots', example: 'Halloween pumpkins are orange', funFact: 'Orange was named after the fruit!' },
  { id: 81, word: 'Purple', image: '🟣', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/ˈpɜːrpəl/', definition: 'The color of grapes and violets', example: 'My favorite crayon is purple', funFact: 'Purple used to be the most expensive color!' },
  { id: 82, word: 'Pink', image: '🩷', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/pɪŋk/', definition: 'A light red color like flamingos', example: 'Cherry blossoms are pink', funFact: 'Pink makes you feel calm!' },
  { id: 83, word: 'Brown', image: '🤎', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/braʊn/', definition: 'The color of chocolate and tree bark', example: 'Bears are usually brown', funFact: 'Brown is made by mixing all colors!' },
  { id: 84, word: 'Black', image: '⚫', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/blæk/', definition: 'The darkest color like night', example: 'The night sky is black', funFact: 'Black absorbs all light!' },
  { id: 85, word: 'White', image: '⚪', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/waɪt/', definition: 'The lightest color like snow', example: 'Clouds are white and fluffy', funFact: 'White reflects all light!' },
  { id: 86, word: 'Gray', image: '🩶', known: false, difficulty: 'easy', category: 'colors', pronunciation: '/ɡreɪ/', definition: 'A color between black and white', example: 'Elephants are gray', funFact: 'Gray is the most common car color!' },
  { id: 87, word: 'Gold', image: '🟨', known: false, difficulty: 'medium', category: 'colors', pronunciation: '/ɡoʊld/', definition: 'A shiny yellow color like treasure', example: 'Olympic medals are gold', funFact: 'Gold never rusts or tarnishes!' },
  { id: 88, word: 'Silver', image: '🩶', known: false, difficulty: 'medium', category: 'colors', pronunciation: '/ˈsɪlvər/', definition: 'A shiny gray color like mirrors', example: 'Spoons are often silver', funFact: 'Silver kills bacteria naturally!' },
  { id: 89, word: 'Rainbow', image: '🌈', known: false, difficulty: 'medium', category: 'colors', pronunciation: '/ˈreɪnboʊ/', definition: 'All colors together in an arc', example: 'Rainbows appear after rain', funFact: 'Rainbows are actually full circles!' },
  { id: 90, word: 'Colorful', image: '🎨', known: false, difficulty: 'medium', category: 'colors', pronunciation: '/ˈkʌlərfəl/', definition: 'Having many bright colors', example: 'The garden is very colorful', funFact: 'Humans can see 10 million colors!' },

  // NUMBERS CATEGORY
  { id: 91, word: 'One', image: '1️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/wʌn/', definition: 'The first number', example: 'I have one nose', funFact: 'One is the only number spelled with letters in reverse alphabetical order!' },
  { id: 92, word: 'Two', image: '2️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/tuː/', definition: 'The number after one', example: 'I have two eyes', funFact: 'Two is the only even prime number!' },
  { id: 93, word: 'Three', image: '3️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/θriː/', definition: 'The number after two', example: 'A triangle has three sides', funFact: 'Three is considered a lucky number!' },
  { id: 94, word: 'Four', image: '4️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/fɔːr/', definition: 'The number after three', example: 'A car has four wheels', funFact: 'Four is the only number with the same number of letters!' },
  { id: 95, word: 'Five', image: '5️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/faɪv/', definition: 'The number after four', example: 'I have five fingers on each hand', funFact: 'Five is the number of senses we have!' },
  { id: 96, word: 'Six', image: '6️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/sɪks/', definition: 'The number after five', example: 'Insects have six legs', funFact: 'Six is the smallest perfect number!' },
  { id: 97, word: 'Seven', image: '7️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/ˈsevən/', definition: 'The number after six', example: 'There are seven days in a week', funFact: 'Seven is the most popular lucky number!' },
  { id: 98, word: 'Eight', image: '8️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/eɪt/', definition: 'The number after seven', example: 'Spiders have eight legs', funFact: 'Eight turned sideways is the infinity symbol!' },
  { id: 99, word: 'Nine', image: '9️⃣', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/naɪn/', definition: 'The number after eight', example: 'Cats have nine lives', funFact: 'Nine is the highest single-digit number!' },
  { id: 100, word: 'Ten', image: '🔟', known: false, difficulty: 'easy', category: 'numbers', pronunciation: '/ten/', definition: 'The number after nine', example: 'I have ten toes', funFact: 'Ten is the base of our number system!' },
  { id: 101, word: 'Zero', image: '0️⃣', known: false, difficulty: 'medium', category: 'numbers', pronunciation: '/ˈzɪroʊ/', definition: 'The number that means nothing', example: 'Zero plus zero equals zero', funFact: 'Zero was invented in India!' },
  { id: 102, word: 'Hundred', image: '💯', known: false, difficulty: 'hard', category: 'numbers', pronunciation: '/ˈhʌndrəd/', definition: 'Ten groups of ten', example: 'There are one hundred pennies in a dollar', funFact: 'A century is one hundred years!' },
  { id: 103, word: 'Dozen', image: '🥚', known: false, difficulty: 'hard', category: 'numbers', pronunciation: '/ˈdʌzən/', definition: 'A group of twelve things', example: 'Eggs come in a dozen', funFact: 'Dozen comes from the French word for twelve!' },
  { id: 104, word: 'Pair', image: '👟', known: false, difficulty: 'medium', category: 'numbers', pronunciation: '/per/', definition: 'Two things that go together', example: 'I have a pair of shoes', funFact: 'Pair comes from the Latin word for equal!' },
  { id: 105, word: 'Half', image: '🍎', known: false, difficulty: 'medium', category: 'numbers', pronunciation: '/hæf/', definition: 'One of two equal parts', example: 'I ate half of my apple', funFact: 'Half is written as 1/2 in fractions!' },

  // ACTIONS CATEGORY
  { id: 106, word: 'Run', image: '🏃', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/rʌn/', definition: 'To move very fast with your legs', example: 'I run to catch the bus', funFact: 'Humans can run up to 28 miles per hour!' },
  { id: 107, word: 'Walk', image: '🚶', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/wɔːk/', definition: 'To move by putting one foot in front of the other', example: 'I walk to school every day', funFact: 'Walking uses 200 muscles!' },
  { id: 108, word: 'Jump', image: '🦘', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/dʒʌmp/', definition: 'To push yourself up into the air', example: 'I can jump over the puddle', funFact: 'The world record jump is 29 feet!' },
  { id: 109, word: 'Swim', image: '🏊', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/swɪm/', definition: 'To move through water', example: 'Fish swim in the ocean', funFact: 'Swimming uses almost every muscle!' },
  { id: 110, word: 'Dance', image: '💃', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/dæns/', definition: 'To move your body to music', example: 'I love to dance to my favorite songs', funFact: 'Dancing makes your brain happy!' },
  { id: 111, word: 'Sing', image: '🎤', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/sɪŋ/', definition: 'To make music with your voice', example: 'Birds sing beautiful songs', funFact: 'Singing is good for your health!' },
  { id: 112, word: 'Sleep', image: '😴', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/sliːp/', definition: 'To rest with your eyes closed', example: 'I sleep eight hours every night', funFact: 'We spend one-third of our lives sleeping!' },
  { id: 113, word: 'Eat', image: '🍽️', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/iːt/', definition: 'To put food in your mouth and swallow', example: 'I eat breakfast every morning', funFact: 'It takes 20 minutes to feel full!' },
  { id: 114, word: 'Drink', image: '🥤', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/drɪŋk/', definition: 'To swallow liquid', example: 'I drink water when I\'m thirsty', funFact: 'You should drink 8 glasses of water daily!' },
  { id: 115, word: 'Play', image: '🎮', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/pleɪ/', definition: 'To have fun with games or toys', example: 'Children love to play together', funFact: 'Playing helps your brain grow!' },
  { id: 116, word: 'Read', image: '📖', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/riːd/', definition: 'To look at words and understand them', example: 'I read a story before bed', funFact: 'Reading makes you smarter!' },
  { id: 117, word: 'Write', image: '✍️', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/raɪt/', definition: 'To make letters and words with a pen', example: 'I write my name on my paper', funFact: 'Writing helps you remember things!' },
  { id: 118, word: 'Draw', image: '🎨', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/drɔː/', definition: 'To make pictures with pencils or crayons', example: 'I draw pictures of my family', funFact: 'Drawing improves hand-eye coordination!' },
  { id: 119, word: 'Laugh', image: '😂', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/læf/', definition: 'To make happy sounds when something is funny', example: 'Jokes make me laugh', funFact: 'Laughing is good exercise!' },
  { id: 120, word: 'Cry', image: '😢', known: false, difficulty: 'easy', category: 'actions', pronunciation: '/kraɪ/', definition: 'To have tears come from your eyes', example: 'I cry when I\'m sad', funFact: 'Crying can make you feel better!' },

  // WEATHER CATEGORY
  { id: 121, word: 'Sunny', image: '☀️', known: false, difficulty: 'easy', category: 'weather', pronunciation: '/ˈsʌni/', definition: 'When the sun is shining bright', example: 'It\'s a sunny day perfect for playing outside', funFact: 'Sunny weather makes people happier!' },
  { id: 122, word: 'Rainy', image: '🌧️', known: false, difficulty: 'easy', category: 'weather', pronunciation: '/ˈreɪni/', definition: 'When water falls from the clouds', example: 'On rainy days, I play inside', funFact: 'Rain helps plants grow!' },
  { id: 123, word: 'Cloudy', image: '☁️', known: false, difficulty: 'easy', category: 'weather', pronunciation: '/ˈklaʊdi/', definition: 'When clouds cover the sky', example: 'It\'s cloudy but not raining', funFact: 'Clouds are made of tiny water droplets!' },
  { id: 124, word: 'Windy', image: '💨', known: false, difficulty: 'easy', category: 'weather', pronunciation: '/ˈwɪndi/', definition: 'When the air moves fast', example: 'It\'s too windy to fly a kite', funFact: 'Wind can power electricity!' },
  { id: 125, word: 'Snowy', image: '❄️', known: false, difficulty: 'easy', category: 'weather', pronunciation: '/ˈsnoʊi/', definition: 'When white flakes fall from the sky', example: 'Snowy days are perfect for sledding', funFact: 'Every snowflake is unique!' },
  { id: 126, word: 'Hot', image: '🔥', known: false, difficulty: 'easy', category: 'weather', pronunciation: '/hɑːt/', definition: 'When the temperature is very warm', example: 'Summer days can be very hot', funFact: 'The hottest place on Earth is Death Valley!' },
  { id: 127, word: 'Cold', image: '🧊', known: false, difficulty: 'easy', category: 'weather', pronunciation: '/koʊld/', definition: 'When the temperature is very cool', example: 'I wear a coat when it\'s cold', funFact: 'The coldest place on Earth is Antarctica!' },
  { id: 128, word: 'Storm', image: '⛈️', known: false, difficulty: 'medium', category: 'weather', pronunciation: '/stɔːrm/', definition: 'Bad weather with wind, rain, and thunder', example: 'We stay inside during a storm', funFact: 'Lightning is hotter than the sun!' },
  { id: 129, word: 'Thunder', image: '⚡', known: false, difficulty: 'medium', category: 'weather', pronunciation: '/ˈθʌndər/', definition: 'The loud sound that comes after lightning', example: 'Thunder sounds like a big drum', funFact: 'You hear thunder after you see lightning!' },
  { id: 130, word: 'Lightning', image: '⚡', known: false, difficulty: 'medium', category: 'weather', pronunciation: '/ˈlaɪtnɪŋ/', definition: 'Bright flashes of light in the sky', example: 'Lightning lights up the dark sky', funFact: 'Lightning strikes Earth 100 times per second!' },

  // TRANSPORTATION CATEGORY
  { id: 131, word: 'Bus', image: '🚌', known: false, difficulty: 'easy', category: 'transportation', pronunciation: '/bʌs/', definition: 'A big vehicle that carries many people', example: 'I ride the school bus every day', funFact: 'The first bus was pulled by horses!' },
  { id: 132, word: 'Train', image: '🚂', known: false, difficulty: 'easy', category: 'transportation', pronunciation: '/treɪn/', definition: 'A long vehicle that runs on tracks', example: 'The train goes choo-choo', funFact: 'Trains can be over a mile long!' },
  { id: 133, word: 'Boat', image: '⛵', known: false, difficulty: 'easy', category: 'transportation', pronunciation: '/boʊt/', definition: 'A vehicle that floats on water', example: 'We sail the boat on the lake', funFact: 'Boats have been used for 10,000 years!' },
  { id: 134, word: 'Truck', image: '🚛', known: false, difficulty: 'easy', category: 'transportation', pronunciation: '/trʌk/', definition: 'A big vehicle that carries heavy things', example: 'The truck delivers packages', funFact: 'Some trucks have 18 wheels!' },
  { id: 135, word: 'Motorcycle', image: '🏍️', known: false, difficulty: 'medium', category: 'transportation', pronunciation: '/ˈmoʊtərsaɪkəl/', definition: 'A vehicle with two wheels and an engine', example: 'Motorcycles are fast and loud', funFact: 'The first motorcycle was made in 1885!' },
  { id: 136, word: 'Helicopter', image: '🚁', known: false, difficulty: 'medium', category: 'transportation', pronunciation: '/ˈhelɪkɑːptər/', definition: 'A flying machine with spinning blades', example: 'The helicopter can hover in the air', funFact: 'Helicopters can fly backwards!' },
  { id: 137, word: 'Rocket', image: '🚀', known: false, difficulty: 'medium', category: 'transportation', pronunciation: '/ˈrɑːkət/', definition: 'A vehicle that flies to space', example: 'Rockets carry astronauts to space', funFact: 'Rockets travel 25,000 miles per hour!' },
  { id: 138, word: 'Skateboard', image: '🛹', known: false, difficulty: 'medium', category: 'transportation', pronunciation: '/ˈskeɪtbɔːrd/', definition: 'A board with wheels you stand on', example: 'I ride my skateboard to the park', funFact: 'Skateboarding started in California!' },
  { id: 139, word: 'Scooter', image: '🛴', known: false, difficulty: 'easy', category: 'transportation', pronunciation: '/ˈskuːtər/', definition: 'A small vehicle you push with your foot', example: 'My scooter has two wheels', funFact: 'Scooters were invented in 1817!' },
  { id: 140, word: 'Taxi', image: '🚕', known: false, difficulty: 'medium', category: 'transportation', pronunciation: '/ˈtæksi/', definition: 'A car you pay to ride in', example: 'We took a taxi to the airport', funFact: 'New York taxis are yellow!' },

  // SCHOOL CATEGORY
  { id: 141, word: 'School', image: '🏫', known: false, difficulty: 'easy', category: 'school', pronunciation: '/skuːl/', definition: 'A place where children learn', example: 'I go to school every weekday', funFact: 'The word school comes from Greek!' },
  { id: 142, word: 'Teacher', image: '👩‍🏫', known: false, difficulty: 'easy', category: 'school', pronunciation: '/ˈtiːtʃər/', definition: 'A person who helps children learn', example: 'My teacher is very kind', funFact: 'Teachers change 3 million lives!' },
  { id: 143, word: 'Student', image: '🧑‍🎓', known: false, difficulty: 'easy', category: 'school', pronunciation: '/ˈstuːdənt/', definition: 'A person who goes to school to learn', example: 'I am a student in second grade', funFact: 'Student means eager to learn!' },
  { id: 144, word: 'Pencil', image: '✏️', known: false, difficulty: 'easy', category: 'school', pronunciation: '/ˈpensəl/', definition: 'A tool for writing and drawing', example: 'I write with a yellow pencil', funFact: 'Pencils can draw a line 35 miles long!' },
  { id: 145, word: 'Paper', image: '📄', known: false, difficulty: 'easy', category: 'school', pronunciation: '/ˈpeɪpər/', definition: 'Thin sheets you write on', example: 'I draw pictures on white paper', funFact: 'Paper was invented in China!' },
  { id: 146, word: 'Eraser', image: '🧽', known: false, difficulty: 'easy', category: 'school', pronunciation: '/ɪˈreɪsər/', definition: 'Something that removes pencil marks', example: 'I use an eraser to fix mistakes', funFact: 'The first eraser was made of bread!' },
  { id: 147, word: 'Crayon', image: '🖍️', known: false, difficulty: 'easy', category: 'school', pronunciation: '/ˈkreɪɑːn/', definition: 'A colored stick for drawing', example: 'I color with my red crayon', funFact: 'Crayola makes 3 billion crayons yearly!' },
  { id: 148, word: 'Backpack', image: '🎒', known: false, difficulty: 'medium', category: 'school', pronunciation: '/ˈbækpæk/', definition: 'A bag you carry on your back', example: 'I put my books in my backpack', funFact: 'Backpacks were first used by soldiers!' },
  { id: 149, word: 'Lunch', image: '🍱', known: false, difficulty: 'easy', category: 'school', pronunciation: '/lʌntʃ/', definition: 'The meal you eat in the middle of the day', example: 'I eat lunch at school', funFact: 'Lunch comes from the word luncheon!' },
  { id: 150, word: 'Playground', image: '🛝', known: false, difficulty: 'medium', category: 'school', pronunciation: '/ˈpleɪɡraʊnd/', definition: 'A place with swings and slides to play', example: 'We have fun on the playground', funFact: 'Playgrounds help children develop!' },

  // EMOTIONS CATEGORY
  { id: 151, word: 'Happy', image: '😊', known: false, difficulty: 'easy', category: 'emotions', pronunciation: '/ˈhæpi/', definition: 'Feeling good and joyful', example: 'I feel happy when I play with friends', funFact: 'Smiling makes you happier!' },
  { id: 152, word: 'Sad', image: '😢', known: false, difficulty: 'easy', category: 'emotions', pronunciation: '/sæd/', definition: 'Feeling unhappy or down', example: 'I feel sad when my pet is sick', funFact: 'It\'s okay to feel sad sometimes!' },
  { id: 153, word: 'Angry', image: '😠', known: false, difficulty: 'easy', category: 'emotions', pronunciation: '/ˈæŋɡri/', definition: 'Feeling mad or upset', example: 'I get angry when someone is mean', funFact: 'Counting to ten helps when angry!' },
  { id: 154, word: 'Excited', image: '🤩', known: false, difficulty: 'medium', category: 'emotions', pronunciation: '/ɪkˈsaɪtəd/', definition: 'Feeling very happy about something', example: 'I\'m excited about my birthday party', funFact: 'Excitement gives you energy!' },
  { id: 155, word: 'Scared', image: '😨', known: false, difficulty: 'easy', category: 'emotions', pronunciation: '/skerd/', definition: 'Feeling afraid or frightened', example: 'I feel scared during thunderstorms', funFact: 'Everyone feels scared sometimes!' },
  { id: 156, word: 'Surprised', image: '😲', known: false, difficulty: 'medium', category: 'emotions', pronunciation: '/sərˈpraɪzd/', definition: 'Feeling shocked by something unexpected', example: 'I was surprised by the birthday party', funFact: 'Surprises make memories stronger!' },
  { id: 157, word: 'Proud', image: '😤', known: false, difficulty: 'medium', category: 'emotions', pronunciation: '/praʊd/', definition: 'Feeling good about something you did', example: 'I feel proud when I help others', funFact: 'Being proud motivates you to do more!' },
  { id: 158, word: 'Worried', image: '😟', known: false, difficulty: 'medium', category: 'emotions', pronunciation: '/ˈwɜːrid/', definition: 'Feeling nervous about something', example: 'I feel worried about the test', funFact: 'Talking about worries helps!' },
  { id: 159, word: 'Calm', image: '😌', known: false, difficulty: 'medium', category: 'emotions', pronunciation: '/kɑːm/', definition: 'Feeling peaceful and relaxed', example: 'I feel calm when I read books', funFact: 'Deep breathing helps you stay calm!' },
  { id: 160, word: 'Confused', image: '😕', known: false, difficulty: 'medium', category: 'emotions', pronunciation: '/kənˈfjuːzd/', definition: 'Not understanding something clearly', example: 'I feel confused by this math problem', funFact: 'It\'s okay to ask questions when confused!' },

  // FAMILY CATEGORY
  { id: 161, word: 'Mother', image: '👩', known: false, difficulty: 'easy', category: 'family', pronunciation: '/ˈmʌðər/', definition: 'A female parent', example: 'My mother makes the best cookies', funFact: 'Mother\'s Day is celebrated worldwide!' },
  { id: 162, word: 'Father', image: '👨', known: false, difficulty: 'easy', category: 'family', pronunciation: '/ˈfɑːðər/', definition: 'A male parent', example: 'My father teaches me to ride a bike', funFact: 'Father\'s Day started in 1910!' },
  { id: 163, word: 'Sister', image: '👧', known: false, difficulty: 'easy', category: 'family', pronunciation: '/ˈsɪstər/', definition: 'A female sibling', example: 'My sister and I play together', funFact: 'Sisters often become best friends!' },
  { id: 164, word: 'Brother', image: '👦', known: false, difficulty: 'easy', category: 'family', pronunciation: '/ˈbrʌðər/', definition: 'A male sibling', example: 'My brother helps me with homework', funFact: 'Brothers teach you to share!' },
  { id: 165, word: 'Grandmother', image: '👵', known: false, difficulty: 'medium', category: 'family', pronunciation: '/ˈɡrænmʌðər/', definition: 'Your parent\'s mother', example: 'Grandmother tells the best stories', funFact: 'Grandmothers spoil their grandchildren!' },
  { id: 166, word: 'Grandfather', image: '👴', known: false, difficulty: 'medium', category: 'family', pronunciation: '/ˈɡrænfɑːðər/', definition: 'Your parent\'s father', example: 'Grandfather taught me to fish', funFact: 'Grandfathers love to give advice!' },
  { id: 167, word: 'Baby', image: '👶', known: false, difficulty: 'easy', category: 'family', pronunciation: '/ˈbeɪbi/', definition: 'A very young child', example: 'The baby sleeps a lot', funFact: 'Babies are born with 300 bones!' },
  { id: 168, word: 'Family', image: '👨‍👩‍👧‍👦', known: false, difficulty: 'easy', category: 'family', pronunciation: '/ˈfæməli/', definition: 'People who love and care for each other', example: 'I love spending time with my family', funFact: 'Family comes in all shapes and sizes!' },
  { id: 169, word: 'Cousin', image: '👫', known: false, difficulty: 'medium', category: 'family', pronunciation: '/ˈkʌzən/', definition: 'Your aunt or uncle\'s child', example: 'My cousin visits during summer', funFact: 'Cousins are your first friends!' },
  { id: 170, word: 'Pet', image: '🐕', known: false, difficulty: 'easy', category: 'family', pronunciation: '/pet/', definition: 'An animal that lives with your family', example: 'Our pet dog is part of the family', funFact: 'Pets make families happier!' },

  // TOYS CATEGORY
  { id: 171, word: 'Doll', image: '🪆', known: false, difficulty: 'easy', category: 'toys', pronunciation: '/dɑːl/', definition: 'A toy that looks like a person', example: 'I brush my doll\'s hair', funFact: 'The oldest doll is 4,000 years old!' },
  { id: 172, word: 'Teddy bear', image: '🧸', known: false, difficulty: 'medium', category: 'toys', pronunciation: '/ˈtedi ber/', definition: 'A soft toy bear for hugging', example: 'I sleep with my teddy bear', funFact: 'Teddy bears were named after President Roosevelt!' },
  { id: 173, word: 'Blocks', image: '🧱', known: false, difficulty: 'easy', category: 'toys', pronunciation: '/blɑːks/', definition: 'Square toys you stack and build with', example: 'I build towers with blocks', funFact: 'Playing with blocks helps your brain!' },
  { id: 174, word: 'Puzzle', image: '🧩', known: false, difficulty: 'medium', category: 'toys', pronunciation: '/ˈpʌzəl/', definition: 'A game with pieces that fit together', example: 'I love solving jigsaw puzzles', funFact: 'Puzzles improve problem-solving skills!' },
  { id: 175, word: 'Kite', image: '🪁', known: false, difficulty: 'medium', category: 'toys', pronunciation: '/kaɪt/', definition: 'A toy that flies in the wind', example: 'We fly kites at the beach', funFact: 'Kites were invented 3,000 years ago!' },
  { id: 176, word: 'Yo-yo', image: '🪀', known: false, difficulty: 'medium', category: 'toys', pronunciation: '/ˈjoʊjoʊ/', definition: 'A toy that goes up and down on a string', example: 'I can do tricks with my yo-yo', funFact: 'Yo-yos were used as weapons long ago!' },
  { id: 177, word: 'Jump rope', image: '🪢', known: false, difficulty: 'medium', category: 'toys', pronunciation: '/dʒʌmp roʊp/', definition: 'A rope you jump over for fun', example: 'We play jump rope at recess', funFact: 'Jump rope is great exercise!' },
  { id: 178, word: 'Marbles', image: '🔮', known: false, difficulty: 'medium', category: 'toys', pronunciation: '/ˈmɑːrbəlz/', definition: 'Small glass balls used in games', example: 'I collect colorful marbles', funFact: 'Marbles have been played for 4,000 years!' },
  { id: 179, word: 'Top', image: '🌀', known: false, difficulty: 'medium', category: 'toys', pronunciation: '/tɑːp/', definition: 'A toy that spins around', example: 'I spin my top on the table', funFact: 'Tops are one of the oldest toys!' },
  { id: 180, word: 'Robot', image: '🤖', known: false, difficulty: 'medium', category: 'toys', pronunciation: '/ˈroʊbɑːt/', definition: 'A toy that looks like a machine person', example: 'My robot toy can walk and talk', funFact: 'The word robot means forced work!' },

  // MUSIC CATEGORY
  { id: 181, word: 'Piano', image: '🎹', known: false, difficulty: 'medium', category: 'music', pronunciation: '/piˈænoʊ/', definition: 'A musical instrument with black and white keys', example: 'I play songs on the piano', funFact: 'A piano has 88 keys!' },
  { id: 182, word: 'Guitar', image: '🎸', known: false, difficulty: 'medium', category: 'music', pronunciation: '/ɡɪˈtɑːr/', definition: 'A musical instrument with strings', example: 'My dad plays guitar and sings', funFact: 'Guitars have been around for 4,000 years!' },
  { id: 183, word: 'Drum', image: '🥁', known: false, difficulty: 'easy', category: 'music', pronunciation: '/drʌm/', definition: 'A musical instrument you hit to make sound', example: 'I beat the drum with sticks', funFact: 'Drums are the world\'s oldest instrument!' },
  { id: 184, word: 'Violin', image: '🎻', known: false, difficulty: 'hard', category: 'music', pronunciation: '/vaɪəˈlɪn/', definition: 'A small string instrument played with a bow', example: 'The violin makes beautiful music', funFact: 'Violins are made from 70 pieces of wood!' },
  { id: 185, word: 'Flute', image: '🪈', known: false, difficulty: 'hard', category: 'music', pronunciation: '/fluːt/', definition: 'A long thin instrument you blow into', example: 'The flute sounds like a bird singing', funFact: 'Flutes are 40,000 years old!' },
  { id: 186, word: 'Song', image: '🎵', known: false, difficulty: 'easy', category: 'music', pronunciation: '/sɔːŋ/', definition: 'Music with words that you sing', example: 'I know all the words to this song', funFact: 'Songs help us remember things!' },
  { id: 187, word: 'Music', image: '🎶', known: false, difficulty: 'easy', category: 'music', pronunciation: '/ˈmjuːzɪk/', definition: 'Sounds that are pleasant to hear', example: 'Music makes me want to dance', funFact: 'Music can change your mood!' },
  { id: 188, word: 'Dance', image: '💃', known: false, difficulty: 'easy', category: 'music', pronunciation: '/dæns/', definition: 'Moving your body to music', example: 'I love to dance to fast songs', funFact: 'Dancing is found in every culture!' },
  { id: 189, word: 'Trumpet', image: '🎺', known: false, difficulty: 'hard', category: 'music', pronunciation: '/ˈtrʌmpət/', definition: 'A brass instrument you blow into', example: 'The trumpet plays loud, bright notes', funFact: 'Trumpets were used in ancient Egypt!' },
  { id: 190, word: 'Microphone', image: '🎤', known: false, difficulty: 'hard', category: 'music', pronunciation: '/ˈmaɪkrəfoʊn/', definition: 'A device that makes your voice louder', example: 'Singers use a microphone on stage', funFact: 'The first microphone was invented in 1876!' },

  // SPORTS CATEGORY
  { id: 191, word: 'Soccer', image: '⚽', known: false, difficulty: 'easy', category: 'sports', pronunciation: '/ˈsɑːkər/', definition: 'A game where you kick a ball into a goal', example: 'I play soccer with my friends', funFact: 'Soccer is the world\'s most popular sport!' },
  { id: 192, word: 'Basketball', image: '🏀', known: false, difficulty: 'medium', category: 'sports', pronunciation: '/ˈbæskətbɔːl/', definition: 'A game where you throw a ball into a hoop', example: 'I shoot baskets at the playground', funFact: 'Basketball was invented with peach baskets!' },
  { id: 193, word: 'Baseball', image: '⚾', known: false, difficulty: 'medium', category: 'sports', pronunciation: '/ˈbeɪsbɔːl/', definition: 'A game with a bat, ball, and four bases', example: 'I hit a home run in baseball', funFact: 'Baseball is America\'s pastime!' },
  { id: 194, word: 'Tennis', image: '🎾', known: false, difficulty: 'medium', category: 'sports', pronunciation: '/ˈtenəs/', definition: 'A game where you hit a ball over a net', example: 'I play tennis with a racket', funFact: 'Tennis was first played by French monks!' },
  { id: 195, word: 'Swimming', image: '🏊', known: false, difficulty: 'medium', category: 'sports', pronunciation: '/ˈswɪmɪŋ/', definition: 'Moving through water as a sport', example: 'Swimming is great exercise', funFact: 'Swimming uses almost every muscle!' },
  { id: 196, word: 'Running', image: '🏃', known: false, difficulty: 'easy', category: 'sports', pronunciation: '/ˈrʌnɪŋ/', definition: 'Moving fast on foot as a sport', example: 'I go running every morning', funFact: 'Running makes your heart stronger!' },
  { id: 197, word: 'Cycling', image: '🚴', known: false, difficulty: 'medium', category: 'sports', pronunciation: '/ˈsaɪklɪŋ/', definition: 'Riding a bicycle as a sport', example: 'Cycling is fun and healthy', funFact: 'Cycling is great for the environment!' },
  { id: 198, word: 'Gymnastics', image: '🤸', known: false, difficulty: 'hard', category: 'sports', pronunciation: '/dʒɪmˈnæstɪks/', definition: 'A sport with flips, jumps, and balance', example: 'Gymnastics requires lots of practice', funFact: 'Gymnastics started in ancient Greece!' },
  { id: 199, word: 'Football', image: '🏈', known: false, difficulty: 'medium', category: 'sports', pronunciation: '/ˈfʊtbɔːl/', definition: 'A game where teams try to score touchdowns', example: 'Football players wear helmets', funFact: 'Football games have four quarters!' },
  { id: 200, word: 'Hockey', image: '🏒', known: false, difficulty: 'hard', category: 'sports', pronunciation: '/ˈhɑːki/', definition: 'A game played on ice with sticks and a puck', example: 'Hockey players skate very fast', funFact: 'Hockey pucks can fly 100 mph!' }
]

// Enhanced categories with subcategories and metadata
export const enhancedCategories = [
  { 
    id: 'food', 
    name: 'Food & Drinks', 
    emoji: '🍎', 
    color: 'from-red-400 to-orange-400',
    description: 'Learn about delicious foods and drinks',
    subcategories: ['fruits', 'vegetables', 'meals', 'snacks', 'drinks']
  },
  { 
    id: 'animals', 
    name: 'Animals', 
    emoji: '🐱', 
    color: 'from-green-400 to-blue-400',
    description: 'Discover amazing animals from around the world',
    subcategories: ['pets', 'farm animals', 'wild animals', 'sea creatures', 'insects']
  },
  { 
    id: 'objects', 
    name: 'Objects & Things', 
    emoji: '🏠', 
    color: 'from-purple-400 to-pink-400',
    description: 'Learn about everyday objects and items',
    subcategories: ['furniture', 'electronics', 'tools', 'vehicles', 'household items']
  },
  { 
    id: 'nature', 
    name: 'Nature & Weather', 
    emoji: '🌳', 
    color: 'from-green-400 to-emerald-400',
    description: 'Explore the natural world around us',
    subcategories: ['plants', 'weather', 'landscapes', 'sky objects', 'natural phenomena']
  },
  { 
    id: 'body', 
    name: 'Body Parts', 
    emoji: '👁️', 
    color: 'from-yellow-400 to-red-400',
    description: 'Learn about parts of the human body',
    subcategories: ['face', 'limbs', 'senses', 'internal organs', 'body systems']
  },
  { 
    id: 'colors', 
    name: 'Colors', 
    emoji: '🌈', 
    color: 'from-pink-400 to-purple-400',
    description: 'Discover the wonderful world of colors',
    subcategories: ['primary colors', 'secondary colors', 'shades', 'patterns', 'color mixing']
  },
  { 
    id: 'numbers', 
    name: 'Numbers & Math', 
    emoji: '🔢', 
    color: 'from-blue-400 to-indigo-400',
    description: 'Learn numbers and basic math concepts',
    subcategories: ['counting', 'basic math', 'shapes', 'measurements', 'time']
  },
  { 
    id: 'actions', 
    name: 'Actions & Verbs', 
    emoji: '🏃', 
    color: 'from-orange-400 to-red-400',
    description: 'Learn about different actions and movements',
    subcategories: ['movement', 'daily activities', 'sports actions', 'creative actions', 'communication']
  },
  { 
    id: 'weather', 
    name: 'Weather', 
    emoji: '☀️', 
    color: 'from-yellow-400 to-blue-400',
    description: 'Learn about different types of weather',
    subcategories: ['sunny weather', 'rainy weather', 'winter weather', 'storms', 'seasons']
  },
  { 
    id: 'transportation', 
    name: 'Transportation', 
    emoji: '🚗', 
    color: 'from-blue-400 to-green-400',
    description: 'Discover different ways to travel and move',
    subcategories: ['land vehicles', 'air vehicles', 'water vehicles', 'public transport', 'personal transport']
  },
  { 
    id: 'school', 
    name: 'School & Learning', 
    emoji: '🏫', 
    color: 'from-indigo-400 to-purple-400',
    description: 'Learn about school and educational items',
    subcategories: ['school supplies', 'school places', 'school people', 'subjects', 'activities']
  },
  { 
    id: 'emotions', 
    name: 'Emotions & Feelings', 
    emoji: '😊', 
    color: 'from-pink-400 to-yellow-400',
    description: 'Understand different emotions and feelings',
    subcategories: ['happy emotions', 'sad emotions', 'excited emotions', 'calm emotions', 'mixed emotions']
  },
  { 
    id: 'family', 
    name: 'Family & People', 
    emoji: '👨‍👩‍👧‍👦', 
    color: 'from-red-400 to-pink-400',
    description: 'Learn about family members and relationships',
    subcategories: ['immediate family', 'extended family', 'family roles', 'family activities', 'community helpers']
  },
  { 
    id: 'toys', 
    name: 'Toys & Games', 
    emoji: '🧸', 
    color: 'from-purple-400 to-blue-400',
    description: 'Discover fun toys and games to play with',
    subcategories: ['stuffed animals', 'building toys', 'outdoor toys', 'board games', 'electronic toys']
  },
  { 
    id: 'music', 
    name: 'Music & Instruments', 
    emoji: '🎵', 
    color: 'from-green-400 to-purple-400',
    description: 'Learn about music and musical instruments',
    subcategories: ['string instruments', 'wind instruments', 'percussion', 'music concepts', 'musical activities']
  },
  { 
    id: 'sports', 
    name: 'Sports & Activities', 
    emoji: '⚽', 
    color: 'from-orange-400 to-green-400',
    description: 'Discover different sports and physical activities',
    subcategories: ['ball sports', 'water sports', 'individual sports', 'team sports', 'outdoor activities']
  }
]

// Utility functions for working with the database
export const getWordsByCategory = (category) => {
  return wordsDatabase.filter(word => word.category === category)
}

export const getWordsByDifficulty = (difficulty) => {
  return wordsDatabase.filter(word => word.difficulty === difficulty)
}

export const getRandomWords = (count = 10) => {
  const shuffled = [...wordsDatabase].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const searchWords = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return wordsDatabase.filter(word => 
    word.word.toLowerCase().includes(lowercaseQuery) ||
    word.definition.toLowerCase().includes(lowercaseQuery) ||
    word.category.toLowerCase().includes(lowercaseQuery)
  )
}

export const getWordById = (id) => {
  return wordsDatabase.find(word => word.id === id)
}

export const getCategoryStats = () => {
  const stats = {}
  enhancedCategories.forEach(category => {
    const categoryWords = getWordsByCategory(category.id)
    stats[category.id] = {
      total: categoryWords.length,
      easy: categoryWords.filter(w => w.difficulty === 'easy').length,
      medium: categoryWords.filter(w => w.difficulty === 'medium').length,
      hard: categoryWords.filter(w => w.difficulty === 'hard').length
    }
  })
  return stats
}

export default wordsDatabase

