<link rel="stylesheet" href="bootstrap.css">
<script src="jquery-3.3.1.min.js"></script>
<script src="bootstrap.js"></script>

<div class = "container" style="margin-top: 50px;">

    <div class = "row">
            <?php
            $conn = mysqli_connect("localhost:8889", "root", "root", "classic models");
            $result = mysqli_query($conn, "SELECT * FROM products");

            while ($row = mysqli_fetch_object($result))
                {
                    ?>

                    <div class = "col-md-3" style = "margin-bottom: 20px;">
                        <div class = "card" style = "height: 200px;">
                            <div clss = "card-body">
                                    <h5  class = "card-title">
                                        <?php echo $row->proudctName; ?>
                                    </h5>
                                    <h5  class = "card-title">
                                        <?php echo $row->buyPrice; ?>
                                    </h5>

                                    <form method="POST" action="add-cart.php">
                                        <input type="hidden" name="quantity" value="1">
                                        <input type="hidden" name="productCode" value="<?php echo $row->productCode; ?>" 
                                        <input type="submit" class="btn btn-primary" value="Add to card">
                                    </form>
                            </div>
                        </div>
                    </div>
                    <?php          
                }
                ?>
                </div>
            </div>