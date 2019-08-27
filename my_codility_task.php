<?php

/*
 * Write a function:
 * function solution($A); that, given an array A of N integers, returns the smallest positive integer (greater than 0) that does not occur in A.
 * For example, given A = [1, 3, 6, 4, 1, 2], the function should return 5.
 * Given A = [1, 2, 3], the function should return 4.
 * Given A = [−1, −3], the function should return 1.
 * Write an efficient algorithm for the following assumptions:
 * N is an integer within the range [1..100,000]; each element of array A is an integer within the range [−1,000,000..1,000,000].
 */
function solution($A) {
    $sizeOf = count($A);
    if ($sizeOf < 1 || $sizeOf > 100000) {
        throw new \Exception("Input array size should be in range [1,100000] but size $sizeOf got");
    }
    $numbers = [];
    foreach($A as $number) {
        if ($number < -1000000 || $number > 1000000) {
            throw new \Exception("Each element should be gt than -1*10^6 and lt than 1*10^6");
        }
        if ($number > 0) {
            $numbers[] = $number;
        }
    }
    if (empty($numbers)) {
        return 1;
    }
    return min(array_diff(range(1, max($numbers) + 1), $numbers));
}
