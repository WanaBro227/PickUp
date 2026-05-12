package vau.ac.lk.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vau.ac.lk.backend.models.Product;
import vau.ac.lk.backend.services.ProductService;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService prdService;

    public ProductController(ProductService prdService) {
        this.prdService = prdService;
    }

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product prd) {
        return ResponseEntity.ok(prdService.createProduct(prd));
    }
}
