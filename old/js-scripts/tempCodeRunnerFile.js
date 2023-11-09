if (error) {
        console.error('Error:', error);
      } else {
        for (const row of results) {
          console.log(`${row.dish_name}\t${row.price}`);
        }
      }