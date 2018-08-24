package cn.showclear.toposystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class MyWebConfigurerAdapter extends WebMvcConfigurerAdapter {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/v1/config/**","classpath:/config/");
//        registry.addResourceHandler("/v1/config","classpath:/config/config.json");
        super.addResourceHandlers(registry);
    }
}
