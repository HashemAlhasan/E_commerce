const agg=[
    {
      '$match': {
        'product': new ObjectId('655d04d0b249541fe5d57e09')
      }
    }, {
      '$group': {
        '_id': '$product', 
        'averageRating': {
          '$avg': '$rating'
        }, 
        'numOfReviews': {
          '$sum': 1
        }
      }
    }
  ]
  //aggergation pipline
  /**
   * so we go to mongodb compass => aggergation => add stage
   * we match all the product then we group them based on pattern then sorting them 
   * i wanna match all the peoduct with some id 
   * then we group them and we calclulate average rating 
   * step 1 :matching
   * we look for the match operator 
   * then i wanna match all the review where a property match somthing  
   *  {
      '$match': {
        'product':  ObjectId('655d04d0b249541fe5d57e09')
      }
      the product match property
        get me all the review where the product propert matches this id 
        step2 : group
        add stage => $group
        the _id proerty should equal some experssions
        i don't want to group based on something
        eatih _d=null for entier list
        or the $product
        remove the field name
        i want to create something new 
        average rating 
         'averageRating': {
          '$avg': '$rating'
        }, 
        use the average opertor $avg
        based on rating
        meaning get the average rating 
        then get the number of reviews
         'numOfReviews': {
          '$sum': 1
        }
        the keys i set them up by my self
        i used $sum operator and to count the 1

   * i set it up using GUI interface 
        for codeing go to model reciew
   * 
   * 
   */